const express = require("express");
const router = express.Router();
const ImportantContent = require("../Schema/importantContent");
const { requireAuth, getAuth } = require("@clerk/express");

// GET /list/:courseId
router.get("/list/:courseId", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req); // Clerk user ID
    const { courseId } = req.params;

    const importantContents = await ImportantContent.find({ courseId, userId });

    res.status(200).json({
      success: true,
      importantContents: importantContents.map((c) => c.chapterName), // sending a list of chapter Headings array which are important
    });
  } catch (err) {
    console.error("Error fetching important chapters:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// POST /important/save
router.post("/save", requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req); // Clerk user ID
    const { courseId, chapterName } = req.body;

    if (!courseId || !chapterName) {
      return res.status(400).json({
        success: false,
        message: "courseId and chapterName are required.",
      });
    }

    // 🔎 Check if already marked important
    const existing = await ImportantContent.findOne({ courseId, chapterName, userId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Already marked as important.",
      });
    }

    // 🆕 Create new important content entry
    const importantContent = new ImportantContent({
      courseId,
      chapterName, // (your schema uses this field name)
      userId,
    });

    await importantContent.save();

    res.status(200).json({
      success: true,
      message: "Chapter marked as important successfully.",
    });
  } catch (err) {
    console.error("Error saving important chapter:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



module.exports = router