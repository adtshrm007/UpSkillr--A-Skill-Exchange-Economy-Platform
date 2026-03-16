import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    skill: { type: String, required: true, trim: true },
    scheduledAt: { type: Date, required: true },
    durationHrs: { type: Number, default: 1, min: 0.5, max: 8 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },
    creditCost: { type: Number, required: true },
    notes: { type: String, default: "" },
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cancelReason: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

sessionSchema.index({ teacher: 1, status: 1 });
sessionSchema.index({ learner: 1, status: 1 });
sessionSchema.index({ scheduledAt: 1 });

const Session = mongoose.model("Session", sessionSchema);
export default Session;
