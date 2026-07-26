const express = require('express');
const router = express.Router();
const MarkedChapter = require("../Schema/markedContent");
const { requireAuth, getAuth } = require('@clerk/express'); // Clerk middleware

// 🟢 Save a Marked Chapter
router.post('/save', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req); // Clerk user ID
    const { courseId, chapterName } = req.body;

    if (!courseId || !chapterName) {
      return res.status(400).json({ message: 'courseId and chapterName are required.' });
    }

    // Check if already marked
    const alreadyMarked = await MarkedChapter.findOne({ courseId, chapterName, userId });
    if (alreadyMarked) {
      return res.status(200).json({ message: 'Already marked', alreadyMarked: true });
    }

    // Create new mark entry
    const markedChapter = new MarkedChapter({ courseId, chapterName, userId });
    await markedChapter.save();

    return res.status(200).json({ message: 'Chapter marked successfully', markedChapter });
  } catch (err) {
    console.error('Error saving marked chapter:', err);
    return res.status(500).json({ message: 'Server error marking chapter' });
  }
});

// 🟢 Get Marked Chapters for a Course
router.get('/list/:courseId', requireAuth(), async (req, res) => {
  try {
    const { userId } = getAuth(req); // Clerk user ID
    const { courseId } = req.params;

    const markedChapters = await MarkedChapter.find({ courseId, userId });

    return res.status(200).json({
      message: 'Fetched marked chapters successfully',
      markedChapters: markedChapters.map((item) => item.chapterName),
    });
  } catch (err) {
    console.error('Error fetching marked chapters:', err);
    return res.status(500).json({ message: 'Server error fetching marked chapters' });
  }
});

module.exports = router;
