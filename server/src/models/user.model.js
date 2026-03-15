import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const SKILLS = [
  "React",
  "MongoDB",
  "Java",
  "Python",
  "JavaScript",
  "Node.js",
  "Express.js",
  "Machine Learning",
  "Artificial Intelligence",
  "Computer Networks",
  "Cyber Security",
  "Data Structures and Algorithms",
];

const skillSchema = new mongoose.Schema({
  skillName: {
    type: String,
    enum: SKILLS,
    required: true,
  },
  skillLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
});

const availabilitySchema = new mongoose.Schema({
  slot: {
    type: String,
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["Available", "Booked"],
    default: "Available",
  },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    teachingSkills: [skillSchema],

    learningSkills: [skillSchema],
    bio: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    skillLevel: {
      type: String,
      enum: [
        "Code Spark",
        "Skill Seeker",
        "Code Crafter",
        "Project Alchemist",
        "Tech Pathfinder",
        "System Architect",
        "Code Legend",
      ],
      default: "Code Spark",
    },

    skillCredits: {
      type: Number,
      default: 0,
    },

    availability: [availabilitySchema],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
