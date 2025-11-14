// routes/quizRoutes.js
import express from "express";
import dotenv from "dotenv";
import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: "./.env" });

const router = express.Router();

// ---------------------------
// 🟢 Initialize Gemini
// ---------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------------------
// 🟢 Helper: Safe JSON Parser
// ---------------------------
function safeJSON(text) {
  try {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("❌ JSON Parse Error:", err);
    return null;
  }
}

// ---------------------------
// 🟢 QUIZ GENERATION
// ---------------------------
router.post("/generate", async (req, res) => {
  const { topic } = req.body;

  if (!topic)
    return res.status(400).json({ success: false, message: "Topic is required." });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    Generate EXACTLY 5 multiple-choice questions about "${topic}".
    Format MUST be:
    [
      {
        "question": "...",
        "options": ["A", "B", "C", "D"],
        "answer": "A"
      }
    ]
    Return ONLY the JSON array.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const quiz = safeJSON(text);

    if (!quiz)
      return res.status(500).json({ success: false, message: "Model returned invalid JSON." });

    res.json({ success: true, quiz });
  } catch (error) {
    console.error("❌ Quiz generation error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating quiz",
      error: error.message,
    });
  }
});

// ---------------------------
// 🟢 QUIZ SUMMARY
// ---------------------------
router.post("/summarize", async (req, res) => {
  try {
    const { quiz, userId, topic, correctCount } = req.body;

    if (!quiz || quiz.length === 0)
      return res.json({ success: false, summary: "No quiz data provided." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const summaryPrompt = `
    Summarize this quiz in 3–4 lines:
    ${JSON.stringify(quiz, null, 2)}
    `;

    const result = await model.generateContent(summaryPrompt);
    const summary = result.response.text();

    // Save progress if user exists
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.progress.push({
          topic: topic || "Untitled Quiz",
          score: correctCount || 0,
          date: new Date(),
        });
        await user.save();
      }
    }

    res.json({ success: true, summary, score: correctCount || 0 });
  } catch (err) {
    console.error("❌ Error summarizing:", err);
    res.json({ success: false, summary: "Error generating summary." });
  }
});

// ---------------------------
// 🟢 EXPLAIN WRONG ANSWERS
// ---------------------------
router.post("/explain", async (req, res) => {
  try {
    const { wrongQuestions } = req.body;

    if (!wrongQuestions || wrongQuestions.length === 0)
      return res.json({ success: false, explanations: [] });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const explainPrompt = `
    Explain why each correct answer below is correct.
    Return ONLY JSON:
    [
      {
        "question": "...",
        "explanation": "..."
      }
    ]
    Data:
    ${JSON.stringify(wrongQuestions, null, 2)}
    `;

    const result = await model.generateContent(explainPrompt);
    const explanations = safeJSON(result.response.text());

    if (!explanations)
      return res.json({ success: false, explanations: [] });

    res.json({ success: true, explanations });
  } catch (err) {
    console.error("❌ Error explaining answers:", err);
    res.json({ success: false, explanations: [] });
  }
});

// ---------------------------
// 🟢 GENERATE FLASHCARDS
// ---------------------------
router.post("/flashcards", async (req, res) => {
  try {
    const { topic, userId } = req.body;

    if (!topic)
      return res.status(400).json({ success: false, message: "Topic is required." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const flashPrompt = `
    Generate EXACTLY 5 flashcards for topic "${topic}".
    Return ONLY JSON array:
    [
      { "question": "...", "answer": "..." }
    ]
    `;

    const result = await model.generateContent(flashPrompt);
    const flashcards = safeJSON(result.response.text());

    if (!flashcards)
      return res.status(500).json({ success: false, message: "Model returned invalid JSON." });

    // Save to user if exists
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (!user.flashcards) user.flashcards = [];
        user.flashcards.push({ topic, data: flashcards, date: new Date() });
        await user.save();
      }
    }

    res.json({ success: true, flashcards });
  } catch (err) {
    console.error("❌ Error generating flashcards:", err);
    res.json({ success: false, message: "Failed to generate flashcards." });
  }
});

// ---------------------------
// 🟢 GET USER
// ---------------------------
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user data" });
  }
});

// ---------------------------
// 🟢 GET FLASHCARD PROGRESS
// ---------------------------
router.get("/user/:id/flashcardsprogress", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({
      success: true,
      flashcards: user.flashcards || [],
    });
  } catch (err) {
    console.error("❌ Error fetching flashcards:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching flashcards",
      error: err.message,
    });
  }
});

export default router;
