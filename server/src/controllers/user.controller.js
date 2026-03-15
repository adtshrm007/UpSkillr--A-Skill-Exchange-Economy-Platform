import userModel from "../models/user.model.js";
import cookieParser from "cookie-parser";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    const newUser = new userModel({
      name: name,
      email: email,
      password: password,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const findUser = await userModel.findOne({ email: email });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const checkPassword = await findUser.isPasswordCorrect(password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const accessToken = await findUser.generateAccessToken();
    const refreshToken = await findUser.generateRefreshToken();
    console.log(accessToken, refreshToken);
    findUser.refreshToken = refreshToken;
    await findUser.save();
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    return res.status(200).json({ message: "User found" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const user = await userModel.findById(req.user?._id);
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.user?._id);
    return res.json(user.name);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  const { name, email, teachingSkills, learningSkills } = req.body;
  try {
    const user = await userModel.findById(req.user?._id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found.Please try logging in again" });
    }

    //update the name and email
    user.name = name;
    user.email = email;
    console.log(teachingSkills);
    if(!teachingSkills){
      user.teachingSkills=[]
    }
    if (teachingSkills && Array.isArray(teachingSkills)) {
      user.teachingSkills = teachingSkills.map((skill) => ({
        skillName: skill.skillName,
        skillLevel: skill.skillLevel || "Beginner",
      }));
    }
    if (learningSkills && Array.isArray(learningSkills)) {
      user.learningSkills = learningSkills.map((skill) => ({
        skillName: skill.skillName,
        skillLevel:"Beginner"
      }));
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
