const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    topic: { type: String, required: true },
    chapters: { type: Array, default: [] },
    userId: { type: String, required: true }, // Clerk user ID
},{timestamps:true});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
