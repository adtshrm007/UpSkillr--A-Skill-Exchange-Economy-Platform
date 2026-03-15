import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getDashboard,
} from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/dashboard", verifyAccessToken, getDashboard);
export default router;
