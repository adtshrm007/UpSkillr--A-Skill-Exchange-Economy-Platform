import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const skillSchema = new mongoose.Schema({
  skillName: { type: String, required: true, trim: true },
  skillLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
    default: "Beginner",
  },
});

const availabilitySchema = new mongoose.Schema({
  dayOfWeek: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
  startTime: { type: String }, // e.g. "09:00"
  endTime: { type: String }, // e.g. "17:00"
  slot: { type: String, required: true }, // Backup for exact dates or specific identifiers
  status: {
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
      lowercase: true,
      trim: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    bio: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },

    teachingSkills: { type: [skillSchema], default: [], index: true },
    learningSkills: { type: [skillSchema], default: [] },

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

    skillCredits: { type: Number, default: 200 },
    reputationScore: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    totalSessionsCompleted: { type: Number, default: 0 },
    totalHoursTaught: { type: Number, default: 0 },

    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    availability: [availabilitySchema],
  },
  { timestamps: true }
);

// ----- Hooks -----
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ----- Methods -----
userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, isAdmin: this.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" }
  );
};

// ----- Indexes -----
userSchema.index({ "teachingSkills.skillName": 1 });
userSchema.index({ "learningSkills.skillName": 1 });
userSchema.index({ reputationScore: -1 });

userSchema.index({ "teachingSkills.skillName": 1, isActive: 1 });
userSchema.index({ "learningSkills.skillName": 1, isActive: 1 });

const userModel = mongoose.model("User", userSchema);
export default userModel;
