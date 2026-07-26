const mongoose = require('mongoose');

const importantContentSchema = new mongoose.Schema({
     courseId:{ type: mongoose.Schema.Types.ObjectId, required: true },
    chapterName: { type: String, required: true }, // should be chapterHeading
     userId: { type: String, required: true, } // Clerk user ID
     },{timestamps:true});

const ImportantContent = mongoose.model('ImportantContent', importantContentSchema);
 module.exports = ImportantContent;