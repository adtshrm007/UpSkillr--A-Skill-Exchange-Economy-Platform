import express from "express";
import { getChatHistory } from "../controllers/chat.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

router.use(verifyAccessToken);

router.get("/:sessionId/history", getChatHistory);

export default router;
