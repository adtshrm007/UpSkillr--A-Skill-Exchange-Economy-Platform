import SwapRequest from "../models/swapRequest.model.js";
import Notification from "../models/notification.model.js";
import { io } from "../../server.js";

async function pushNotification(userId, type, message, data = {}) {
  const notif = await Notification.create({ recipient: userId, type, message, data });
  io.to(`user:${userId.toString()}`).emit("notification:new", notif);
  return notif;
}

// POST /swaps/request
export const sendSwapRequest = async (req, res) => {
  try {
    const { recipientId, requesterSkill, recipientSkill, message } = req.body;
    if (!recipientId || !requesterSkill || !recipientSkill)
      return res.status(400).json({ message: "recipientId, requesterSkill, and recipientSkill are required" });

    if (recipientId === req.user._id.toString())
      return res.status(400).json({ message: "You cannot swap with yourself" });

    // Check for existing active swap between these two users
    const existing = await SwapRequest.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id },
      ],
      status: { $in: ["Requested", "Accepted", "Scheduled"] },
    });
    if (existing)
      return res.status(409).json({ message: "An active swap already exists between you two" });

    const swap = await SwapRequest.create({
      requester: req.user._id,
      recipient: recipientId,
      requesterSkill: requesterSkill.trim(),
      recipientSkill: recipientSkill.trim(),
      message: message || "",
    });

    await pushNotification(
      recipientId,
      "SWAP_REQUEST",
      `${req.user.name} wants to swap ${requesterSkill} ↔ ${recipientSkill}`,
      { swapId: swap._id }
    );

    return res.status(201).json({ message: "Swap request sent", swap });
  } catch (error) {
    console.error("[sendSwapRequest]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /swaps/:id/respond
export const respondToSwap = async (req, res) => {
  try {
    const { action } = req.body; // "accept" | "reject"
    if (!["accept", "reject"].includes(action))
      return res.status(400).json({ message: "action must be 'accept' or 'reject'" });

    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    if (!swap.recipient.equals(req.user._id))
      return res.status(403).json({ message: "Only the recipient can respond to this swap" });

    if (swap.status !== "Requested")
      return res.status(400).json({ message: "This swap is no longer pending" });

    if (action === "accept") {
      swap.status = "Accepted";
      await swap.save();
      await pushNotification(
        swap.requester,
        "SWAP_ACCEPTED",
        `${req.user.name} accepted your swap request!`,
        { swapId: swap._id }
      );
      return res.status(200).json({ message: "Swap accepted", swap });
    } else {
      swap.status = "Cancelled";
      swap.cancelledBy = req.user._id;
      await swap.save();
      return res.status(200).json({ message: "Swap rejected", swap });
    }
  } catch (error) {
    console.error("[respondToSwap]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /swaps/:id/schedule
export const scheduleSwap = async (req, res) => {
  try {
    const { scheduledAt } = req.body;
    if (!scheduledAt)
      return res.status(400).json({ message: "scheduledAt is required" });

    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    const isParticipant = swap.requester.equals(req.user._id) || swap.recipient.equals(req.user._id);
    if (!isParticipant) return res.status(403).json({ message: "Not authorized" });

    if (swap.status !== "Accepted")
      return res.status(400).json({ message: "Swap must be Accepted before scheduling" });

    swap.status = "Scheduled";
    swap.scheduledAt = new Date(scheduledAt);
    await swap.save();

    const otherId = swap.requester.equals(req.user._id) ? swap.recipient : swap.requester;
    await pushNotification(otherId, "SWAP_REQUEST", `Your swap has been scheduled!`, { swapId: swap._id });

    return res.status(200).json({ message: "Swap scheduled", swap });
  } catch (error) {
    console.error("[scheduleSwap]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /swaps/:id/complete
export const completeSwap = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    const isParticipant = swap.requester.equals(req.user._id) || swap.recipient.equals(req.user._id);
    if (!isParticipant) return res.status(403).json({ message: "Not authorized" });

    if (swap.status !== "Scheduled")
      return res.status(400).json({ message: "Swap must be Scheduled to complete" });

    swap.status = "Completed";
    swap.completedAt = new Date();
    await swap.save();

    const otherId = swap.requester.equals(req.user._id) ? swap.recipient : swap.requester;
    await pushNotification(otherId, "SWAP_COMPLETED", `Your skill swap is complete! Leave a review.`, { swapId: swap._id });
    await pushNotification(req.user._id, "SWAP_COMPLETED", `Your skill swap is complete! Leave a review.`, { swapId: swap._id });

    return res.status(200).json({ message: "Swap completed", swap });
  } catch (error) {
    console.error("[completeSwap]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /swaps/:id/cancel
export const cancelSwap = async (req, res) => {
  try {
    const swap = await SwapRequest.findById(req.params.id);
    if (!swap) return res.status(404).json({ message: "Swap not found" });

    const isParticipant = swap.requester.equals(req.user._id) || swap.recipient.equals(req.user._id);
    if (!isParticipant) return res.status(403).json({ message: "Not authorized" });

    if (["Completed", "Cancelled"].includes(swap.status))
      return res.status(400).json({ message: "Swap is already finalized" });

    swap.status = "Cancelled";
    swap.cancelledBy = req.user._id;
    await swap.save();

    const otherId = swap.requester.equals(req.user._id) ? swap.recipient : swap.requester;
    await pushNotification(otherId, "SWAP_CANCELLED", `${req.user.name} cancelled the swap request.`, { swapId: swap._id });

    return res.status(200).json({ message: "Swap cancelled", swap });
  } catch (error) {
    console.error("[cancelSwap]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /swaps/my
export const listMySwaps = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user._id;

    const query = { $or: [{ requester: userId }, { recipient: userId }] };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [swaps, total] = await Promise.all([
      SwapRequest.find(query)
        .populate("requester", "name email profilePhoto reputationScore")
        .populate("recipient", "name email profilePhoto reputationScore")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      SwapRequest.countDocuments(query),
    ]);

    return res.status(200).json({ swaps, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[listMySwaps]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
