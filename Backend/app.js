const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const{clerkMiddleware} = require("@clerk/express");

dotenv.config();

const app = express();

// ✅ Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",              // local dev
  "https://course-maker-mu.vercel.app"  // deployed frontend
];

// ✅ CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ Parse JSON
app.use(express.json());

// ✅ Clerk middleware (handles auth)
app.use(clerkMiddleware());

// ✅ Routes
app.use("/gemini", require("./route/geminiAPI"));
app.use("/marked", require("./route/markedHeading"));
app.use("/important",require("./route/importantHeading"));
app.use("/user",require("./route/userHistoryRoute"));
app.use("/course",require("./route/courseRoute"));

app.use((req, res, next) => {
  console.log(req.method, req.originalUrl);
  next();
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

const connectDatabase = async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Database connected successfully!");
  }catch(error){
    console.error("🔥 Database connection error:", error);
  }
}

// Connect to the database
connectDatabase();

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
