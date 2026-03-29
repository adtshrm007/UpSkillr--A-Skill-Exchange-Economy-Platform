import express from "express";
import {
  findMatches,
  findTeachers,
} from "../controllers/matches.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

router.get("/", verifyAccessToken, findMatches);
// Legacy route kept for frontend compatibility
router.get("/getMatches", verifyAccessToken, findMatches);
router.get("/getTeachers", verifyAccessToken, findTeachers);
export default router;
