const express = require("express");
const router = express.Router();
const Course = require("../Schema/course");
const UserCourseProgress = require("../Schema/userhistroy");
const { requireAuth, getAuth } = require("@clerk/express");


// 🟢 Get all courses for the logged-in user
router.get("/getCourses", requireAuth(), async (req, res) => {
  try {
    console.log("Fetching courses for user:"); // Debugging line
    const { userId } = getAuth(req);

    const courses = await Course.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, courseData: courses });
  } catch (err) {
    console.error("Error fetching courses:", err);
    return res.status(500).json({ success: false, message: "Server error fetching courses" });
  }
});

// 🟢 Get all courses for the users
router.get("/getallCourses", requireAuth(), async (req, res) => {
  try {
    console.log("Fetching courses for user:"); // Debugging line
    const { userId } = getAuth(req);

    const courses = await Course.find({ userId: { $ne: userId } }).sort({ createdAt: -1 });
    console.log("Fetched courses:", courses); // Debugging line

    return res.status(200).json({ success: true, courseData: courses });
  } catch (err) {
    console.error("Error fetching courses:", err);
    return res.status(500).json({ success: false, message: "Server error fetching courses" });
  }
});


// Save a new course
router.post("/saveCourse", requireAuth(), async (req, res) => {
  try {
    console.log("saving course");
    const { title, topic, chapters } = req.body;

    // Using getAuth to get userId in clerk-express
    const { userId } = getAuth(req);

    if (!title || !topic || !chapters) {
      return res.status(400).json({ error: "Title and topic and Chapters are required" });
    }

    const newCourse = new Course({
      title,
      topic,
      chapters: chapters,
      userId,
    });

    const savedCourse = await newCourse.save();

    // ✅ Create initial progress/history entry
    const saveCourseProgress = new UserCourseProgress({
      userId,
      courseId: savedCourse._id,
      lastAccessed: new Date(),
    });

    await saveCourseProgress.save();

    return res.status(201).json(savedCourse);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save course" });
  }
});


// ✅ PUT /course/progress
router.put("/progress", requireAuth(), async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: "courseId is required" });
    }

    // Get Clerk userId from the request
    const { userId } = getAuth(req);

    // Check if progress already exists
    const existingProgress = await UserCourseProgress.findOne({ userId, courseId });

    if (!existingProgress) {
      return res.status(404).json({ message: "Progress record not found" });
    }

    // if (existingProgress) {
    // If exists, update lastAccessed
    existingProgress.lastAccessed = Date.now();
    await existingProgress.save();
    return res.status(200).json(existingProgress);
    // } else {
    //   // If not, create a new progress entry
    //   const newProgress = new UserCourseProgress({
    //     userId,
    //     courseId,
    //     lastAccessed: Date.now()
    //   });
    //   await newProgress.save();
    //   return res.status(201).json(newProgress);
    // }

  } catch (error) {
    console.error("Error updating course progress:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId); // ✅ now courseId is clean
    if (course) {
      return res.status(200).json({ course });
    } else {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;