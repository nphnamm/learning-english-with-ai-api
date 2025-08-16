import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";
import textRoutes from "./routes/text.routes";
import lessonRoutes from "./routes/lesson.routes";

const app = express();
const PORT = process.env.PORT || 8080;
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000",""];

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Sử dụng cookie-parser để đọc cookie từ request
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/text", textRoutes);
app.use("/api/lessons", lessonRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
