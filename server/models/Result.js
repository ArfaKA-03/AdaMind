import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema({
  userId: String,
  score: Number,
  mistakes: Array,
  feedback: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Result", ResultSchema);
