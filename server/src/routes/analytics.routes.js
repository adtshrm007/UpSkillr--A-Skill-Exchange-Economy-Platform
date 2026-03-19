import express from "express";
import { verifyAccessToken } from "../middleware/authVerify.js";
import { pingPlatformActivity, getWeeklyAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

router.post("/ping", verifyAccessToken, pingPlatformActivity);
router.get("/weekly", verifyAccessToken, getWeeklyAnalytics);

export default router;
