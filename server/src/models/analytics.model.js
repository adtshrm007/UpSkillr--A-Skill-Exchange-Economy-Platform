import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: String, // format YYYY-MM-DD
      required: true,
      index: true,
    },
    platformMinutes: {
      type: Number,
      default: 0,
    },
    sessionMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Unique entry per user per day
analyticsSchema.index({ userId: 1, date: 1 }, { unique: true });

const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;
