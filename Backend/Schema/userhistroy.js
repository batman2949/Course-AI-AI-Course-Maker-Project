const mongoose = require("mongoose");
const Course = require("./course");

const userCourseProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: Course , required: true },
  lastAccessed: { type: Date, default: Date.now }
}, { timestamps: true });

const UserCourseProgress = mongoose.model("UserCourseProgress", userCourseProgressSchema);
module.exports = UserCourseProgress;