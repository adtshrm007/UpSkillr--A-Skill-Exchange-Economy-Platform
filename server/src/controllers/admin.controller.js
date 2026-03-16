import userModel from "../models/user.model.js";
import Session from "../models/session.model.js";
import SwapRequest from "../models/swapRequest.model.js";
import CreditTransaction from "../models/creditTransaction.model.js";

// Admin-only middleware check
export const requireAdmin = (req, res, next) => {
  if (!req.user?.isAdmin)
    return res.status(403).json({ message: "Admin access required" });
  next();
};

// GET /admin/users
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = search
      ? { $or: [{ name: new RegExp(search, "i") }, { email: new RegExp(search, "i") }] }
      : {};

    const [users, total] = await Promise.all([
      userModel
        .find(query)
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      userModel.countDocuments(query),
    ]);

    return res.status(200).json({ users, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[getUsers]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /admin/users/:id
export const getUserDetail = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password -refreshToken").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("[getUserDetail]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /admin/stats
export const getPlatformStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalSessions,
      completedSessions,
      totalSwaps,
      completedSwaps,
      creditsInCirculation,
    ] = await Promise.all([
      userModel.countDocuments(),
      Session.countDocuments(),
      Session.countDocuments({ status: "Completed" }),
      SwapRequest.countDocuments(),
      SwapRequest.countDocuments({ status: "Completed" }),
      userModel.aggregate([{ $group: { _id: null, total: { $sum: "$skillCredits" } } }]),
    ]);

    return res.status(200).json({
      totalUsers,
      totalSessions,
      completedSessions,
      totalSwaps,
      completedSwaps,
      creditsInCirculation: creditsInCirculation[0]?.total || 0,
    });
  } catch (error) {
    console.error("[getPlatformStats]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PATCH /admin/users/:id/toggle-status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isAdmin)
      return res.status(403).json({ message: "Cannot suspend an admin user" });

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      message: `User ${user.isActive ? "activated" : "suspended"} successfully`,
      isActive: user.isActive,
    });
  } catch (error) {
    console.error("[toggleUserStatus]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
