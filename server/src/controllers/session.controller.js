import Session from "../models/session.model.js";
import userModel from "../models/user.model.js";
import CreditTransaction from "../models/creditTransaction.model.js";
import Notification from "../models/notification.model.js";
import { getIO } from "../utils/socket.js";
import { checkAndApplyLevelUp } from "../utils/skillLevelCheck.js";
import Analytics from "../models/analytics.model.js";


const CREDITS_PER_HOUR = 10;

// Helper: emit a notification socket event
async function pushNotification(userId, type, message, data = {}) {
  const notif = await Notification.create({ recipient: userId, type, message, data });
  getIO().to(`user:${userId.toString()}`).emit("notification:new", notif);
  return notif;
}

// POST /sessions/book
export const bookSession = async (req, res) => {
  try {
    const { teacherId, requestedSkill, offeredSkill, scheduledAt, durationHrs = 1, notes } = req.body;

    if (!teacherId || !requestedSkill || !scheduledAt)
      return res.status(400).json({ message: "teacherId, requestedSkill, and scheduledAt are required" });

    const learner = await userModel.findById(req.user._id);
    const teacher = await userModel.findById(teacherId);

    if (!teacher || !teacher.isActive)
      return res.status(404).json({ message: "Teacher not found" });

    if (teacher._id.equals(learner._id))
      return res.status(400).json({ message: "You cannot book a session with yourself" });

    const creditCost = offeredSkill ? 0 : Math.round(durationHrs * CREDITS_PER_HOUR);

    if (learner.skillCredits < creditCost)
      return res.status(400).json({ message: `Insufficient credits. Need ${creditCost}, have ${learner.skillCredits}` });

    // Deduct credits from learner
    const learnerBefore = learner.skillCredits;
    learner.skillCredits -= creditCost;
    await learner.save({ validateBeforeSave: false });

    await CreditTransaction.create({
      user: learner._id,
      amount: -creditCost,
      type: "DEBIT",
      reason: offeredSkill ? `Mutual swap session: ${requestedSkill} for ${offeredSkill} with ${teacher.name}` : `Booked session: ${requestedSkill} with ${teacher.name}`,
      balanceBefore: learnerBefore,
      balanceAfter: learner.skillCredits,
    });

    const session = await Session.create({
      teacher: teacher._id,
      learner: learner._id,
      requestedSkill,
      offeredSkill: offeredSkill || "",
      scheduledAt: new Date(scheduledAt),
      durationHrs,
      creditCost,
      status: "Confirmed",
      notes: notes || "",
    });

    const swapText = offeredSkill ? ` They are offering ${offeredSkill} in return!` : "";
    await pushNotification(
      teacher._id,
      "SESSION_BOOKED",
      `${learner.name} booked a ${durationHrs}hr session for ${requestedSkill}.${swapText}`,
      { sessionId: session._id }
    );

    // Notify learner of credit deduction
    getIO().to(`user:${learner._id.toString()}`).emit("credits:changed", {
      balance: learner.skillCredits,
      change: -creditCost,
    });

    return res.status(201).json({ message: "Session booked successfully", session });
  } catch (error) {
    console.error("[bookSession]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /sessions/my
export const listMySessions = async (req, res) => {
  try {
    const { status, role, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const query = {};
    if (role === "teacher") query.teacher = userId;
    else if (role === "learner") query.learner = userId;
    else query.$or = [{ teacher: userId }, { learner: userId }];

    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [sessions, total] = await Promise.all([
      Session.find(query)
        .populate("teacher", "name email profilePhoto reputationScore")
        .populate("learner", "name email profilePhoto")
        .sort({ scheduledAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Session.countDocuments(query),
    ]);

    return res.status(200).json({ sessions, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[listMySessions]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /sessions/:id/cancel
export const cancelSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const userId = req.user._id.toString();
    const isParticipant = session.teacher.toString() === userId || session.learner.toString() === userId;
    if (!isParticipant) return res.status(403).json({ message: "Not authorized" });

    if (!["Pending", "Confirmed"].includes(session.status))
      return res.status(400).json({ message: "Session cannot be cancelled at this stage" });

    session.status = "Cancelled";
    session.cancelledBy = userId;
    session.cancelReason = req.body.reason || "";
    await session.save();

    // Refund learner
    const learner = await userModel.findById(session.learner);
    const before = learner.skillCredits;
    learner.skillCredits += session.creditCost;
    await learner.save({ validateBeforeSave: false });

    await CreditTransaction.create({
      user: learner._id,
      amount: session.creditCost,
      type: "CREDIT",
      reason: `Cancelled session: ${session.requestedSkill}`,
      balanceBefore: before,
      balanceAfter: learner.skillCredits,
      relatedSession: session._id,
    });

    const otherParty = session.teacher.toString() === userId ? session.learner : session.teacher;
    await pushNotification(otherParty, "SESSION_CANCELLED", `Session "${session.requestedSkill}" was cancelled.`, { sessionId: session._id });
    getIO().to(`user:${learner._id.toString()}`).emit("credits:changed", { balance: learner.skillCredits, change: session.creditCost });

    return res.status(200).json({ message: "Session cancelled and credits refunded", session });
  } catch (error) {
    console.error("[cancelSession]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /sessions/:id
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("teacher", "name email profilePhoto reputationScore")
      .populate("learner", "name email profilePhoto")
      .lean();

    if (!session) return res.status(404).json({ message: "Session not found" });

    const userId = req.user._id.toString();
    const isParticipant =
      session.teacher._id.toString() === userId || session.learner._id.toString() === userId;
    if (!isParticipant)
      return res.status(403).json({ message: "Not authorized" });

    return res.status(200).json({ session });
  } catch (error) {
    console.error("[getSessionById]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /sessions/:id/complete
export const completeSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (!session.teacher.equals(req.user._id))
      return res.status(403).json({ message: "Only the teacher can mark a session as complete" });

    if (session.status !== "Confirmed")
      return res.status(400).json({ message: "Session must be Confirmed to complete" });

    // If a call is still running, finalize it
    if (session.callStartedAt) {
      const elapsed = Math.round((Date.now() - session.callStartedAt.getTime()) / 60000);
      session.actualCallMinutes += elapsed;
      session.callStartedAt = null;
    }

    session.status = "Completed";
    session.completedAt = new Date();
    await session.save();

    // Calculate credits from actual call duration
    const rawHrs = session.actualCallMinutes / 60;
    const actualHrs = Math.max(0.5, Math.ceil(rawHrs * 2) / 2); // round up to nearest 0.5hr, min 0.5
    const cappedHrs = Math.min(actualHrs, session.durationHrs); // cap at booked duration
    const earned = Math.round(cappedHrs * CREDITS_PER_HOUR);

    // Award teacher credits and update stats
    const teacher = await userModel.findById(session.teacher);
    const teacherBefore = teacher.skillCredits;
    teacher.skillCredits += earned;
    teacher.totalSessionsCompleted += 1;
    teacher.totalHoursTaught += cappedHrs;
    await checkAndApplyLevelUp(teacher);
    await teacher.save({ validateBeforeSave: false });

    await CreditTransaction.create({
      user: teacher._id,
      amount: earned,
      type: "CREDIT",
      reason: `Taught session: ${session.requestedSkill} (${session.actualCallMinutes} min call)`,
      balanceBefore: teacherBefore,
      balanceAfter: teacher.skillCredits,
      relatedSession: session._id,
    });

    getIO().to(`user:${teacher._id.toString()}`).emit("credits:changed", { balance: teacher.skillCredits, change: earned });

    // Notify learner to leave review and update learner stats (and award swap credits if applicable)
    const learner = await userModel.findById(session.learner);
    learner.totalSessionsCompleted += 1;
    
    // If it's a mutual swap session, the learner also earns the credits / teaching hours!
    if (session.offeredSkill) {
      const learnerBefore = learner.skillCredits;
      learner.skillCredits += earned;
      learner.totalHoursTaught += cappedHrs;
      
      await CreditTransaction.create({
        user: learner._id,
        amount: earned,
        type: "CREDIT",
        reason: `Taught swap session: ${session.offeredSkill} (${session.actualCallMinutes} min call)`,
        balanceBefore: learnerBefore,
        balanceAfter: learner.skillCredits,
        relatedSession: session._id,
      });
      getIO().to(`user:${learner._id.toString()}`).emit("credits:changed", { balance: learner.skillCredits, change: earned });
    }
    
    await checkAndApplyLevelUp(learner);
    await learner.save({ validateBeforeSave: false });
    
    await pushNotification(session.learner, "SESSION_COMPLETED", `Your session "${session.requestedSkill}" is complete! Please leave a review.`, { sessionId: session._id });

    // Emit socket event to the call room so both users instantly see the review prompt
    getIO().to(`call:${session._id.toString()}`).emit("session_completed", { sessionId: session._id });

    // Update Analytics for both participants
    const today = new Date().toISOString().split("T")[0];
    const minutes = session.actualCallMinutes || 0;
    
    await Analytics.findOneAndUpdate(
      { userId: session.teacher, date: today },
      { $inc: { sessionMinutes: minutes } },
      { upsert: true }
    );
    await Analytics.findOneAndUpdate(
      { userId: session.learner, date: today },
      { $inc: { sessionMinutes: minutes } },
      { upsert: true }
    );

    return res.status(200).json({ message: "Session completed", earned, actualMinutes: session.actualCallMinutes, session });

  } catch (error) {
    console.error("[completeSession]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

