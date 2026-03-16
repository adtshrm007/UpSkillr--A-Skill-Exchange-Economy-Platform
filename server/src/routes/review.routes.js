import express from "express";
import { createReview, getReviewsByUser } from "../controllers/review.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

router.use(verifyAccessToken);

router.post("/", createReview);
router.get("/user/:userId", getReviewsByUser);

export default router;
