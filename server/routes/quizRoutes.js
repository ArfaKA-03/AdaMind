// routes/quizRoutes.js
import express from "express";
import User from "../models/User.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// -------- QUIZ GENERATION --------
router.post("/generate", async (req, res) => {
  const { topic } = req.body;
  if (!topic)
    return res
      .status(400)
      .json({ success: false, message: "Topic is required." });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `
    Generate 5 multiple-choice questions about "${topic}".
    Each question must have:
    - "question": The question text
    - "options": An array of 4 choices
    - "answer": The correct option text
    Return ONLY a pure JSON array, no markdown, no extra text.
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim().replace(/```json|```/g, "");
    const quiz = JSON.parse(text);
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

// -------- QUIZ SUMMARIZATION --------
router.post("/summarize", async (req, res) => {
  try {
    const { quiz, userId, topic, correctCount } = req.body;
    if (!quiz || quiz.length === 0) {
      return res.json({ success: false, summary: "No quiz data provided." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const summaryPrompt = `
    Summarize this quiz in 3–4 lines:
    ${JSON.stringify(quiz, null, 2)}
    Highlight the main ideas and topic.
    `;

    const result = await model.generateContent(summaryPrompt);
    const summary = result.response.text();

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

// -------- EXPLANATION FOR WRONG ANSWERS --------
router.post("/explain", async (req, res) => {
  try {
    const { wrongQuestions } = req.body;
    if (!wrongQuestions || wrongQuestions.length === 0) {
      return res.json({ success: false, explanations: [] });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const explainPrompt = `
    For each of these quiz questions, give a 2–3 line explanation of why the correct answer is right.
    Questions:
    ${JSON.stringify(wrongQuestions, null, 2)}
    Respond strictly in JSON as an array like:
    [{"question": "...", "explanation": "..."}]
    `;

    const result = await model.generateContent(explainPrompt);
    const text = result.response.text().trim().replace(/```json|```/g, "");
    const explanations = JSON.parse(text);

    res.json({ success: true, explanations });
  } catch (err) {
    console.error("❌ Error explaining answers:", err);
    res.json({ success: false, explanations: [] });
  }
});

// -------- GENERATE FLASHCARDS --------
router.post("/flashcards", async (req, res) => {
  try {
    const { topic, userId } = req.body;

    if (!topic)
      return res.status(400).json({ success: false, message: "Topic is required." });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const flashPrompt = `
    Generate 5 concise flashcards on "${topic}".
    Each flashcard should have:
    - "question": a short concept or term to recall
    - "answer": a brief and clear explanation
    Return ONLY JSON array format like:
    [{"question": "...", "answer": "..."}]
    `;

    const result = await model.generateContent(flashPrompt);
    const text = result.response.text().trim().replace(/```json|```/g, "");
    const flashcards = JSON.parse(text);

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

// -------- GET USER PROGRESS --------
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching user data" });
  }
});

// -------- GET SAVED FLASHCARDS FOR USER --------
router.get("/user/:id/flashcardsprogress", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Return user's saved flashcards
    res.json({
      success: true,
      flashcards: user.flashcards || [], // empty array if none
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
