import express from "express";
import User from "../models/User.js";
import Result from "../models/Result.js";

const router = express.Router();

/* ======================================
   ✅ Save Quiz Result for a User
====================================== */
router.post("/save-result", async (req, res) => {
  try {
    const { userId, quizId, topic, score } = req.body;

    if (!userId || !topic) {
      return res
        .status(400)
        .json({ success: false, message: "Missing userId or topic" });
    }

    // 🟢 Save in Result collection
    const result = new Result({
      userId,
      quizId,
      topic,
      score,
      date: new Date(),
    });
    await result.save();

    // 🟢 Push to user's quizzes array
    await User.findByIdAndUpdate(userId, {
      $push: {
        quizzes: {
          quizId,
          topic,
          score,
          date: new Date(),
        },
      },
    });

    res.json({ success: true, message: "Result saved successfully!" });
  } catch (err) {
    console.error("❌ Error saving result:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ======================================
   ✅ Get User Progress + Results
====================================== */
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const results = await Result.find({ userId: user._id }).sort({ date: -1 });

    res.json({
      success: true,
      user,
      results,
    });
  } catch (err) {
    console.error("❌ Error fetching progress:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
