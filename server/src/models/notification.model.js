import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "SWAP_REQUEST",
        "SWAP_ACCEPTED",
        "SWAP_CANCELLED",
        "SWAP_COMPLETED",
        "SESSION_BOOKED",
        "SESSION_CANCELLED",
        "SESSION_COMPLETED",
        "CREDITS_CHANGED",
        "MATCH_FOUND",
        "REVIEW_RECEIVED",
      ],
      required: true,
    },
    message: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
