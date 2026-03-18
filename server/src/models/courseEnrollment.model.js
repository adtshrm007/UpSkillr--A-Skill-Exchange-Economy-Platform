import mongoose from "mongoose";

const courseEnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    creditCostPaid: { type: Number, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }], // Store lesson _ids here
  },
  { timestamps: true }
);

// Prevent duplicate enrollments
courseEnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

const CourseEnrollment = mongoose.model("CourseEnrollment", courseEnrollmentSchema);
export default CourseEnrollment;
