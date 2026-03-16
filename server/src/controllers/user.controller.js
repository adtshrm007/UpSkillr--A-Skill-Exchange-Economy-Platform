import userModel from "../models/user.model.js";
import CreditTransaction from "../models/creditTransaction.model.js";

// Helper: create a signed cookie response
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// POST /user/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters" });

    const existing = await userModel.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ message: "An account with this email already exists" });

    const newUser = await userModel.create({ name: name.trim(), email, password });

    // Log the signup bonus credit transaction
    await CreditTransaction.create({
      user: newUser._id,
      amount: 200,
      type: "CREDIT",
      reason: "Signup bonus",
      balanceBefore: 0,
      balanceAfter: 200,
    });

    return res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.error("[registerUser]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// POST /user/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ message: "No account found with this email" });

    if (!user.isActive)
      return res.status(403).json({ message: "Account suspended. Contact support." });

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch)
      return res.status(401).json({ message: "Incorrect password" });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 10 * 24 * 60 * 60 * 1000 });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        skillCredits: user.skillCredits,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("[loginUser]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// POST /user/logout
export const logoutUser = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("[logoutUser]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /user/me
export const getMe = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("-password -refreshToken");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("[getMe]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /user/dashboard
export const getDashboard = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("-password -refreshToken");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("[getDashboard]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// PUT /user/update
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, teachingSkills, learningSkills } = req.body;

    const user = await userModel.findById(req.user._id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;

    if (Array.isArray(teachingSkills)) {
      user.teachingSkills = teachingSkills
        .filter((s) => s.skillName?.trim())
        .map((s) => ({
          skillName: s.skillName.trim(),
          skillLevel: s.skillLevel || "Beginner",
        }));
    }

    if (Array.isArray(learningSkills)) {
      user.learningSkills = learningSkills
        .filter((s) => s.skillName?.trim())
        .map((s) => ({
          skillName: s.skillName.trim(),
          skillLevel: s.skillLevel || "Beginner",
        }));
    }

    await user.save();

    const updated = user.toObject();
    delete updated.password;
    delete updated.refreshToken;

    return res.status(200).json({ message: "Profile updated successfully", user: updated });
  } catch (error) {
    console.error("[updateProfile]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /user/checkLoggedIn  (kept for legacy compat — now returns full user)
export const checkLoggedIn = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("-password -refreshToken");
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
