import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import quizRoutes from "./routes/quizRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Result from "./models/Result.js";

dotenv.config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// ✅ Routes
app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
