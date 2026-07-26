const express = require("express");
const router = express.Router();
const{ requireAuth, getAuth } = require("@clerk/express");
const UserHistory = require("../Schema/userhistroy");
const Course = require("../Schema/course");
const MarkedChapter = require("../Schema/markedContent");
const ImportantContent = require("../Schema/importantContent");

router.get("/getHistoryProgress", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req);
    console.log("Fetching history progress for user:", userId); // Debugging line

    const visitedCourses = await UserHistory.find({ userId })
      .sort({ lastAccessed: -1 })
      .lean();

    const progressData = await Promise.all(
      visitedCourses.map(async (history) => {
        const course = await Course.findById(history.courseId).lean();

        const completedChapters = await MarkedChapter.find({
          userId,
          courseId: history.courseId
        }).select("chapterName -_id").lean();

        const importantChapters = await ImportantContent.find({
          userId,
          courseId: history.courseId
        }).select("chapterName -_id").lean();

        // Chapter info with number of headings
        const chaptersWithHeadingCount = course.chapters.map(chapter => ({
          chapterName: chapter.chapterName,
          summary: chapter.summary,
          numberOfHeadings: chapter.content.length
        }));

        // Total headings across all chapters
        const totalHeadings = course.chapters.reduce(
          (sum, chapter) => sum + chapter.content.length,
          0
        );

        console.log({courseId: history.courseId,
          courseTitle: course.title,
          courseTopic: course.topic,
          totalChapters: course.chapters.length,  // ✅ total chapters
          totalHeadings:totalHeadings,                           // ✅ total content headings
          lastAccessed: history.lastAccessed,
          completedChapters: completedChapters.map(c => c.chapterName),
          importantChapters: importantChapters.map(c => c.chapterName),
          chapters: chaptersWithHeadingCount})

        return {
          courseId: history.courseId,
          courseTitle: course.title,
          courseTopic: course.topic,
          totalChapters: course.chapters.length,  // ✅ total chapters
          totalHeadings:totalHeadings,                           // ✅ total content headings
          lastAccessed: history.lastAccessed,
          completedChapters: completedChapters.map(c => c.chapterName),
          importantChapters: importantChapters.map(c => c.chapterName),
          chapters: chaptersWithHeadingCount
        };
      })
    );

    return res.status(200).json(progressData);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;