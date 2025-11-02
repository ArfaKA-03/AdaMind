// src/pages/LandingPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return alert("Enter a topic first.");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        let errMsg = "Quiz generation failed.";
        try {
          const errData = await response.json();
          if (errData && errData.message) errMsg = errData.message;
        } catch {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      if (data.success && data.quiz) {
        // ✅ Pass quiz data to QuizPage via router state
        navigate("/quiz", { state: { topic, quiz: data.quiz } });
      } else {
        alert("Quiz generation failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-container">
      <h1>AI Learning Assistant</h1>
      <input
        type="text"
        placeholder="Enter topic (e.g., AI, Cloud, ML)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <button onClick={handleGenerateQuiz} disabled={loading}>
        {loading ? "Generating..." : "Generate Quiz"}
      </button>
    </div>
  );
};

export default LandingPage;
