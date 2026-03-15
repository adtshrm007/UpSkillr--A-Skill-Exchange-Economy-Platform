import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token",
      });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await userModel.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        message: "Invalid Token",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token verification failed",
    });
  }
};
