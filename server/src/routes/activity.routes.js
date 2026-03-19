import express from "express";
import { verifyAccessToken } from "../middleware/authVerify.js";
import { pingActivity, getActivityStats } from "../controllers/userActivity.controller.js";

const router = express.Router();

router.post("/ping", verifyAccessToken, pingActivity);
router.get("/stats", verifyAccessToken, getActivityStats);

export default router;
