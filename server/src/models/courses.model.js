import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    lessonName: { type: String, required: true },
    videoUrl: { type: String, required: true },
    lessonNotes: { type: String, default: "" },
    practiceSheetUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    creditCost: { type: Number, required: true, min: 0 },
    lessons: [lessonSchema],
    enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

courseSchema.index({ instructor: 1, category: 1 });

const Course = mongoose.model("Course", courseSchema);
export default Course;