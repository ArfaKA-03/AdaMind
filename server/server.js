import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
Signup.jsx:19 
 POST http://localhost:5000/api/auth/signup net::ERR_FAILED
onSubmit	@	Signup.jsx:19

Signup.jsx:45 Signup error: TypeError: Failed to fetch
    at onSubmit (Signup.jsx:19:25)
onSubmit	@	Signup.jsx:45
﻿

// ===============================
// 🟢 Load .env
// ===============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, ".env"),
});

// ===============================
// 🟢 Initialize App
// ===============================
const app = express();

// ===============================
// 🟢 Middleware
// ===============================
app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "*" // allow all origins in prod
        : "http://localhost:5000",
    credentials: true,
  })
);

// ===============================
// 🟢 MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
// 🟢 API Routes
// ===============================
import quizRoutes from "./routes/quizRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API working!" });
});

// ===============================
// 🟢 Serve React in Production
// ===============================
if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "../client/build");
  app.use(express.static(clientBuildPath));

  // ⚡ Safe catch-all route that excludes /api
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// ===============================
// 🟢 Start Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`)
);
