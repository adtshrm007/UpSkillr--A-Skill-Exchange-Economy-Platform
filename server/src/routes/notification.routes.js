import express from "express";
import {
  getMyNotifications,
  markAsRead,
  markAllRead,
} from "../controllers/notification.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

router.use(verifyAccessToken);

router.get("/", getMyNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markAsRead);

export default router;
