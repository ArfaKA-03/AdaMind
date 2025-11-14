import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ===============================
// 🟢 Load .env from server folder
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
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "*" // Allow all origins in production
        : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ===============================
// 🟢 MongoDB Connection
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===============================
// 🟢 Import Routes
// ===============================
import quizRoutes from "./routes/quizRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

app.use("/api/quiz", quizRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ===============================
// 🟢 Test route
// ===============================
app.get("/api/test", (req, res) => {
  res.json({ message: "API working!" });
});

// ===============================
// 🟢 Serve React Frontend in Production
// ===============================
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const clientBuildPath = path.join(__dirname, "../client/build");
  app.use(express.static(clientBuildPath));

  // Catch all route must be after API routes
  app.get("*", (req, res) => {
    // Only serve index.html if the request doesn't start with /api
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(clientBuildPath, "index.html"));
    }
  });
}

// ===============================
// 🟢 Start Server
// ===============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT} (${process.env.NODE_ENV})`)
);
