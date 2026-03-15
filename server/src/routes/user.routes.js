import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getDashboard,
  getMe,
  updateProfile
} from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/dashboard", verifyAccessToken, getDashboard);
router.get("/checkLoggedIn", verifyAccessToken, getMe);
router.put("/update",verifyAccessToken,updateProfile);
export default router;
