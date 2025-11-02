// src/pages/Flashcards.jsx
import React, { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "./Flashcards.css";

function Flashcards() {
  const { darkMode } = useContext(ThemeContext);
  const [topic, setTopic] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("quizwhizz_user"));

  // 🔹 Generate and Save Flashcards
  const generateFlashcards = async () => {
    if (!topic.trim()) return alert("Enter a topic!");
    if (!user?._id) return alert("You must be logged in to generate flashcards.");

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/quiz/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, userId: user._id }),
      });

      const data = await res.json();
      if (data.success) {
        setFlashcards(data.flashcards);
      } else {
        alert("❌ Error generating flashcards.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error connecting to backend.");
    }
    setLoading(false);
  };

  return (
    <div className={`flashcards-container ${darkMode ? "dark" : "light"}`}>
      <h2>AI Flashcards</h2>

      {/* Input Section */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter a topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button onClick={generateFlashcards} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Generated Flashcards Display */}
      {flashcards.length > 0 ? (
        <div className="flashcards-list">
          <h3>Flashcards for: {topic}</h3>
          <div className="flashcard-grid">
            {flashcards.map((f, i) => (
              <div key={i} className="flashcard">
                <h4>{f.question}</h4>
                <p>{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-flashcards">No flashcards yet. Generate a new set!</p>
      )}
    </div>
  );
}

export default Flashcards;
