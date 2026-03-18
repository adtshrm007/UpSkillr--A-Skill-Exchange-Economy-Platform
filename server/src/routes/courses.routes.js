import express from "express";
import {
  createCourse,
  getCourses,
  getMyCreatedCourses,
  getMyEnrolledCourses,
  getCourseDetail,
  enrollCourse,
  addLesson,
  deleteCourse,
} from "../controllers/courses.controller.js";
import { verifyAccessToken } from "../middleware/authVerify.js";

const router = express.Router();

// Publicly visible optionally but verify access token conditionally handled inside getCourseDetail
// To simplify, let's just make everything authenticated.
router.use(verifyAccessToken);

router.post("/", createCourse);
router.get("/", getCourses);
router.get("/my-created", getMyCreatedCourses);
router.get("/my-enrolled", getMyEnrolledCourses);
router.get("/:id", getCourseDetail);
router.post("/:id/enroll", enrollCourse);
router.post("/:id/lessons", addLesson);
router.delete("/:id", deleteCourse);

export default router;
