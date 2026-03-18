import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  getDashboard,
  updateProfile,
  checkLoggedIn,
  getPublicProfile,
} from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyAccessToken, logoutUser);
router.get("/me", verifyAccessToken, getMe);
router.get("/dashboard", verifyAccessToken, getDashboard);
router.get("/checkLoggedIn", verifyAccessToken, checkLoggedIn);
router.put("/update", verifyAccessToken, updateProfile);
router.get("/profile/:id", verifyAccessToken, getPublicProfile);

export default router;
