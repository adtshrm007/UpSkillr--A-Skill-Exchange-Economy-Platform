import Session from "../models/session.model.js";
import userModel from "../models/user.model.js";
import CreditTransaction from "../models/creditTransaction.model.js";
import Notification from "../models/notification.model.js";
import { getIO } from "../utils/socket.js";

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
    const { teacherId, skill, scheduledAt, durationHrs = 1, notes } = req.body;

    if (!teacherId || !skill || !scheduledAt)
      return res.status(400).json({ message: "teacherId, skill, and scheduledAt are required" });

    const learner = await userModel.findById(req.user._id);
    const teacher = await userModel.findById(teacherId);

    if (!teacher || !teacher.isActive)
      return res.status(404).json({ message: "Teacher not found" });

    if (teacher._id.equals(learner._id))
      return res.status(400).json({ message: "You cannot book a session with yourself" });

    const creditCost = Math.round(durationHrs * CREDITS_PER_HOUR);

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
      reason: `Booked session: ${skill} with ${teacher.name}`,
      balanceBefore: learnerBefore,
      balanceAfter: learner.skillCredits,
    });

    const session = await Session.create({
      teacher: teacher._id,
      learner: learner._id,
      skill,
      scheduledAt: new Date(scheduledAt),
      durationHrs,
      creditCost,
      status: "Confirmed",
      notes: notes || "",
    });

    // Notify teacher
    await pushNotification(
      teacher._id,
      "SESSION_BOOKED",
      `${learner.name} booked a ${durationHrs}hr session with you: ${skill}`,
      { sessionId: session._id }
    );

    // Notify learner of credit deduction
    io.to(`user:${learner._id.toString()}`).emit("credits:changed", {
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

    const userId = req.user._id;
    const isParticipant = session.teacher.equals(userId) || session.learner.equals(userId);
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
      reason: `Cancelled session: ${session.skill}`,
      balanceBefore: before,
      balanceAfter: learner.skillCredits,
      relatedSession: session._id,
    });

    const otherParty = session.teacher.equals(userId) ? session.learner : session.teacher;
    await pushNotification(otherParty, "SESSION_CANCELLED", `Session "${session.skill}" was cancelled.`, { sessionId: session._id });
    io.to(`user:${learner._id.toString()}`).emit("credits:changed", { balance: learner.skillCredits, change: session.creditCost });

    return res.status(200).json({ message: "Session cancelled and credits refunded", session });
  } catch (error) {
    console.error("[cancelSession]", error);
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

    session.status = "Completed";
    session.completedAt = new Date();
    await session.save();

    // Award teacher credits
    const teacher = await userModel.findById(session.teacher);
    const teacherBefore = teacher.skillCredits;
    const earned = session.creditCost;
    teacher.skillCredits += earned;
    await teacher.save({ validateBeforeSave: false });

    await CreditTransaction.create({
      user: teacher._id,
      amount: earned,
      type: "CREDIT",
      reason: `Taught session: ${session.skill}`,
      balanceBefore: teacherBefore,
      balanceAfter: teacher.skillCredits,
      relatedSession: session._id,
    });

    io.to(`user:${teacher._id.toString()}`).emit("credits:changed", { balance: teacher.skillCredits, change: earned });

    // Notify learner to leave review
    await pushNotification(session.learner, "SESSION_COMPLETED", `Your session "${session.skill}" is complete! Please leave a review.`, { sessionId: session._id });

    return res.status(200).json({ message: "Session completed", earned, session });
  } catch (error) {
    console.error("[completeSession]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
