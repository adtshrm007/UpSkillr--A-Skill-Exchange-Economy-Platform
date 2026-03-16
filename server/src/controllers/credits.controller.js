import CreditTransaction from "../models/creditTransaction.model.js";
import userModel from "../models/user.model.js";

// GET /credits/balance
export const getBalance = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("skillCredits name");
    return res.status(200).json({ balance: user.skillCredits });
  } catch (error) {
    console.error("[getBalance]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /credits/transactions
export const getTransactionHistory = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [transactions, total] = await Promise.all([
      CreditTransaction.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      CreditTransaction.countDocuments({ user: req.user._id }),
    ]);

    return res.status(200).json({ transactions, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[getTransactionHistory]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
