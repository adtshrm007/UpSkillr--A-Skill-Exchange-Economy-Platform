import Review from "../models/review.model.js";
import userModel from "../models/user.model.js";
import Session from "../models/session.model.js";
import SwapRequest from "../models/swapRequest.model.js";
import Notification from "../models/notification.model.js";
import { io } from "../../server.js";

// POST /reviews
export const createReview = async (req, res) => {
  try {
    const { revieweeId, sessionId, swapRequestId, rating, comment } = req.body;

    if (!revieweeId || !rating)
      return res.status(400).json({ message: "revieweeId and rating are required" });

    if (rating < 1 || rating > 5)
      return res.status(400).json({ message: "Rating must be between 1 and 5" });

    // Validate the session/swap exists and is completed, and user is a participant
    if (sessionId) {
      const session = await Session.findById(sessionId);
      if (!session || session.status !== "Completed")
        return res.status(400).json({ message: "Session must be completed to review" });
      const isParticipant = session.teacher.equals(req.user._id) || session.learner.equals(req.user._id);
      if (!isParticipant)
        return res.status(403).json({ message: "Not a participant in this session" });
    }

    if (swapRequestId) {
      const swap = await SwapRequest.findById(swapRequestId);
      if (!swap || swap.status !== "Completed")
        return res.status(400).json({ message: "Swap must be completed to review" });
      const isParticipant = swap.requester.equals(req.user._id) || swap.recipient.equals(req.user._id);
      if (!isParticipant)
        return res.status(403).json({ message: "Not a participant in this swap" });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      session: sessionId || undefined,
      swapRequest: swapRequestId || undefined,
      rating,
      comment: comment?.slice(0, 500) || "",
    });

    // Recalculate reviewee reputation score
    const reviews = await Review.find({ reviewee: revieweeId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await userModel.findByIdAndUpdate(revieweeId, {
      reputationScore: Math.round(avg * 10) / 10,
      totalReviews: reviews.length,
    });

    // Notify reviewee
    const notif = await Notification.create({
      recipient: revieweeId,
      type: "REVIEW_RECEIVED",
      message: `${req.user.name} left you a ${rating}★ review.`,
      data: { reviewId: review._id },
    });
    io.to(`user:${revieweeId.toString()}`).emit("notification:new", notif);

    return res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    if (error.code === 11000)
      return res.status(409).json({ message: "You have already reviewed this session/swap" });
    console.error("[createReview]", error);
    return res.status(500).json({ message: "Server Error" });
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
