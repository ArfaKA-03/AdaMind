// src/pages/LandingPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "./LandingPage.css";

const LandingPage = () => {
  const { darkMode } = useContext(ThemeContext);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      alert("Please enter a topic first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/quiz/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success && data.quiz) {
        navigate("/quiz", { state: { topic, quiz: data.quiz } });
      } else {
        alert(data.message || "Failed to generate quiz. Try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error while generating quiz.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`landing-page ${darkMode ? "dark" : "light"}`}>
      <div className="landing-container">
        <h1>Generate a Quiz with AdaMind</h1>
        <p className="subtitle">
          Type any topic (like AI, Cloud Computing, or DBMS) and let AdaMind
          create questions for you.
        </p>

        <input
          type="text"
          placeholder="Enter topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />

        <button onClick={handleGenerateQuiz} disabled={loading}>
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
