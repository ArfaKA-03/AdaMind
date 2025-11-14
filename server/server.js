// server/server.js (ES module)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Example API route
app.get("/api/ping", (req, res) => res.json({ ok: true, time: Date.now() }));

// Connect to MongoDB (use process.env.MONGO_URI)
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("MONGO_URI missing in env — server will still start but DB won't connect");
} else {
  mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err.message));
}

// Serve React build (from client/dist or client/build depending on your build tool)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../client/dist"); // Vite default output is `dist`. For CRA: ../client/build

app.use(express.static(clientBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
