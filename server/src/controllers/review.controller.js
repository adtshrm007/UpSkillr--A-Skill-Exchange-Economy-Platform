import mongoose from "mongoose";
import Review from "../models/review.model.js";
import userModel from "../models/user.model.js";
import Session from "../models/session.model.js";

import Notification from "../models/notification.model.js";
import { getIO } from "../utils/socket.js";
import { checkAndApplyLevelUp } from "../utils/skillLevelCheck.js";

// POST /reviews
export const createReview = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { sessionId, rating, comment } = req.body;
    const reviewerId = req.user._id;

    if (!sessionId || !rating) {
      await session.abortTransaction();
      return res.status(400).json({ message: "sessionId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // 1. Fetch session and determine reviewee
    const targetSession = await Session.findById(sessionId).session(session);
    if (!targetSession || targetSession.status !== "Completed") {
      await session.abortTransaction();
      return res.status(400).json({ message: "Session must be completed to review" });
    }

    // Identify participants
    const isTeacher = targetSession.teacher.equals(reviewerId);
    const isLearner = targetSession.learner.equals(reviewerId);

    if (!isTeacher && !isLearner) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Not a participant in this session" });
    }

    // Reviewee is the OTHER participant
    const revieweeId = isTeacher ? targetSession.learner : targetSession.teacher;

    if (reviewerId.toString() === revieweeId.toString()) {
      await session.abortTransaction();
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    // 2. Check if review already exists for this (session, reviewer)
    const existing = await Review.findOne({ session: sessionId, reviewer: reviewerId }).session(session);
    if (existing) {
      await session.abortTransaction();
      return res.status(409).json({ message: "You have already reviewed this session" });
    }

    // 3. Create the review
    const [review] = await Review.create([{
      reviewer: reviewerId,
      reviewee: revieweeId,
      session: sessionId,
      rating,
      comment: comment?.slice(0, 500) || "",
    }], { session });

    // 4. Mark session as reviewed by this user (Add to Set prevents duplicates)
    await Session.findByIdAndUpdate(
      sessionId, 
      { $addToSet: { reviewedBy: reviewerId } },
      { session }
    );

    // 5. Update reviewee reputation and stats
    const reviews = await Review.find({ reviewee: revieweeId }).session(session);
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    const revieweeUser = await userModel.findById(revieweeId).session(session);
    if (revieweeUser) {
      revieweeUser.reputationScore = Math.round(avg * 10) / 10;
      revieweeUser.totalReviews = reviews.length;
      await checkAndApplyLevelUp(revieweeUser);
      await revieweeUser.save({ session, validateBeforeSave: false });
    }

    await session.commitTransaction();

    // Async Notifications
    const notif = await Notification.create({
      recipient: revieweeId,
      type: "REVIEW_RECEIVED",
      message: `${req.user.name ?? "A user"} left you a ${rating}★ review.`,
      data: { reviewId: review._id },
    });
    getIO().to(`user:${revieweeId.toString()}`).emit("notification:new", notif);

    return res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    // Handle uniqueness violation from DB
    if (error.code === 11000) {
      return res.status(409).json({ message: "You have already reviewed this session" });
    }
    console.error("[createReview]", error);
    return res.status(500).json({ message: "Server Error" });
  } finally {
    session.endSession();
  }
};


// GET /reviews/user/:userId
export const getReviewsByUser = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ reviewee: req.params.userId })
        .populate("reviewer", "name profilePhoto")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Review.countDocuments({ reviewee: req.params.userId }),
    ]);

    return res.status(200).json({ reviews, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[getReviewsByUser]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
