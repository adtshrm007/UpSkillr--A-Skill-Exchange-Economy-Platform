import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    requesterSkill: { type: String, required: true, trim: true },
    recipientSkill: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Requested", "Accepted", "Scheduled", "Completed", "Cancelled"],
      default: "Requested",
      index: true,
    },
    scheduledAt: { type: Date },
    message: { type: String, default: "" },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

swapRequestSchema.index({ requester: 1, status: 1 });
swapRequestSchema.index({ recipient: 1, status: 1 });

const SwapRequest = mongoose.model("SwapRequest", swapRequestSchema);
export default SwapRequest;
