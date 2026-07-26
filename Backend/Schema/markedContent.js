const mongoose = require('mongoose');

const markedChapterSchema = new mongoose.Schema({
     courseId:{ type: mongoose.Schema.Types.ObjectId, required: true },
     chapterName: { type: String, required: true, }, // should be chapter heading 
      userId: { type: String,  required: true, }   //// Clerk user ID
     },{timestamps:true});

const MarkedChapter = mongoose.model('MarkedChapter', markedChapterSchema);
module.exports = MarkedChapter;