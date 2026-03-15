import mongoose from "mongoose";

const lessons = new mongoose.Schema(
  {
    lessonName: {
      type: String,
      required: true,
    },
    videoLecture: {
      type: String,
      required: true,
    },
    lessonNotes: {
      type: String,
      required: true,
    },
    practiceSheet: {
      type: String,
    },
  },
  { timestamps: true },
);

const coursesSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    lessons: [lessons],
  },
  { timestamps: true },
);

const coursesModel = mongoose.model("course", coursesSchema);
export default coursesModel;