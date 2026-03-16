import express from "express";
import {
  sendSwapRequest,
  respondToSwap,
  scheduleSwap,
  completeSwap,
  cancelSwap,
  listMySwaps,
} from "../controllers/swap.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

router.use(verifyAccessToken);

router.post("/request", sendSwapRequest);
router.get("/my", listMySwaps);
router.patch("/:id/respond", respondToSwap);
router.patch("/:id/schedule", scheduleSwap);
router.patch("/:id/complete", completeSwap);
router.patch("/:id/cancel", cancelSwap);

export default router;
