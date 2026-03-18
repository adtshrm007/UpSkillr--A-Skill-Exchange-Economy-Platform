import mongoose from "mongoose";

const creditTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    reason: { type: String, required: true, trim: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    relatedSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
  },
  { timestamps: true }
);

creditTransactionSchema.index({ user: 1, createdAt: -1 });

const CreditTransaction = mongoose.model("CreditTransaction", creditTransactionSchema);
export default CreditTransaction;
