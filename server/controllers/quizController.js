import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const summarizeQuiz = async (req, res) => {
  try {
    const { userId, topic, quiz, answers, score } = req.body;

    if (!topic || topic.trim() === "") {
      return res.status(400).json({ success: false, message: "Topic missing in request." });
    }

    // ✅ Generate summary using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const quizText = quiz.map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.answer}`).join("\n");
    const prompt = `Summarize the key learnings from this ${topic} quiz:\n${quizText}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    // ✅ Save progress in database with actual topic
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (!user.progress) user.progress = [];

        user.progress.push({
          topic: topic.trim(), // ✅ now uses actual topic
          score,
          date: new Date(),
        });

        await user.save();
      }
    }

    res.json({ success: true, summary });
  } catch (error) {
    console.error("❌ Error in summarizeQuiz:", error);
    res.status(500).json({ success: false, message: "Error generating summary" });
  }
};
