import Course from "../models/courses.model.js";
import CourseEnrollment from "../models/courseEnrollment.model.js";
import userModel from "../models/user.model.js";
import CreditTransaction from "../models/creditTransaction.model.js";

// POST /courses
export const createCourse = async (req, res) => {
  try {
    const { title, description, category, creditCost } = req.body;
    
    // Check if user has > 1000 credits to be a Course Creator
    // if (req.user.skillCredits < 1000) {
    //   return res.status(403).json({ message: "You need at least 1000 credits to become a Course Creator." });
    // }

    if (!title || !description || !category || creditCost === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await Course.create({
      instructor: req.user._id,
      title,
      description,
      category,
      creditCost,
    });

    return res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("[createCourse]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /courses
export const getCourses = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const query = {};
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate("instructor", "name profilePhoto reputationScore")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Course.countDocuments(query),
    ]);

    return res.status(200).json({ courses, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[getCourses]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /courses/my-created
export const getMyCreatedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({ courses });
  } catch (error) {
    console.error("[getMyCreatedCourses]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /courses/my-enrolled
export const getMyEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await CourseEnrollment.find({ user: req.user._id })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name" },
      })
      .sort({ createdAt: -1 });
    
    return res.status(200).json({ enrollments });
  } catch (error) {
    console.error("[getMyEnrolledCourses]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// GET /courses/:id
export const getCourseDetail = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name bio profilePhoto reputationScore");
    
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Hide lesson actual URLs unless enrolled or instructor
    let hideContent = true;
    if (req.user) {
      if (course.instructor._id.equals(req.user._id)) {
        hideContent = false;
      } else {
        const enrolled = await CourseEnrollment.findOne({ user: req.user._id, course: course._id });
        if (enrolled) hideContent = false;
      }
    }

    const courseData = course.toObject();
    if (hideContent) {
      courseData.lessons = courseData.lessons.map(l => ({
        _id: l._id,
        lessonName: l.lessonName,
        // hide videoUrl and practiceSheetUrl
      }));
    }

    return res.status(200).json(courseData);
  } catch (error) {
    console.error("[getCourseDetail]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// POST /courses/:id/enroll
export const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.equals(req.user._id)) {
      return res.status(400).json({ message: "You cannot enroll in your own course" });
    }

    const existingEnrollment = await CourseEnrollment.findOne({ user: req.user._id, course: courseId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "You are already enrolled in this course" });
    }

    const learner = await userModel.findById(req.user._id);
    if (learner.skillCredits < course.creditCost) {
      return res.status(400).json({ message: `Insufficient credits. Need ${course.creditCost}` });
    }

    // Deduct from learner
    const learnerBefore = learner.skillCredits;
    learner.skillCredits -= course.creditCost;
    await learner.save({ validateBeforeSave: false });

    await CreditTransaction.create({
      user: learner._id,
      amount: -course.creditCost,
      type: "DEBIT",
      reason: `Enrolled in course: ${course.title}`,
      balanceBefore: learnerBefore,
      balanceAfter: learner.skillCredits,
    });

    // Pay to instructor
    const instructor = await userModel.findById(course.instructor);
    const instBefore = instructor.skillCredits;
    instructor.skillCredits += course.creditCost;
    await instructor.save({ validateBeforeSave: false });

    await CreditTransaction.create({
      user: instructor._id,
      amount: course.creditCost,
      type: "CREDIT",
      reason: `Course enrollment: ${course.title}`,
      balanceBefore: instBefore,
      balanceAfter: instructor.skillCredits,
    });

    // Update course totals
    course.totalEarnings += course.creditCost;
    course.enrolledUsers.push(learner._id);
    await course.save();

    const enrollment = await CourseEnrollment.create({
      user: learner._id,
      course: course._id,
      creditCostPaid: course.creditCost,
    });

    return res.status(200).json({ message: "Successfully enrolled in course", enrollment });
  } catch (error) {
    console.error("[enrollCourse]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// POST /courses/:id/lessons (Instructor only)
export const addLesson = async (req, res) => {
  try {
    const { lessonName, videoUrl, lessonNotes, practiceSheetUrl } = req.body;
    
    if (!lessonName || !videoUrl) {
      return res.status(400).json({ message: "lessonName and videoUrl are required" });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.instructor.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to modify this course" });
    }

    course.lessons.push({ lessonName, videoUrl, lessonNotes, practiceSheetUrl });
    await course.save();

    return res.status(201).json({ message: "Lesson added successfully", course });
  } catch (error) {
    console.error("[addLesson]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// DELETE /courses/:id (Instructor only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.instructor.equals(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);
    await CourseEnrollment.deleteMany({ course: req.params.id });

    return res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("[deleteCourse]", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
