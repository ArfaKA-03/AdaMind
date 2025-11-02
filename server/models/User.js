// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ✅ Define User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🧠 Track user quiz progress
  progress: [
    {
      topic: { type: String, required: true },
      score: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],

  // 🪄 Store AI-generated flashcards
  flashcards: [
    {
      topic: { type: String, required: true },
      data: [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
        },
      ],
      date: { type: Date, default: Date.now },
    },
  ],
});

// 🔒 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Compare entered password with stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Export the model
const User = mongoose.model("User", userSchema);
export default User;
