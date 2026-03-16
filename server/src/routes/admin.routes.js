import express from "express";
import {
  getUsers,
  getUserDetail,
  getPlatformStats,
  toggleUserStatus,
  requireAdmin,
} from "../controllers/admin.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

router.use(verifyAccessToken, requireAdmin);

router.get("/users", getUsers);
router.get("/users/:id", getUserDetail);
router.get("/stats", getPlatformStats);
router.patch("/users/:id/toggle-status", toggleUserStatus);

export default router;
