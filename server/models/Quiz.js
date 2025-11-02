import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  topic: String,
  questions: Array,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Quiz", QuizSchema);
