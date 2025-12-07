import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "./ResultPage.css";

function ResultPage() {
  const navigate = useNavigate();
  const { darkMode } = useContext(ThemeContext); // using darkMode so ESLint won't complain

  const [topic, setTopic] = useState("");
  const [score, setScore] = useState(null);
  const [summary, setSummary] = useState("");
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const [showExplanations, setShowExplanations] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Save dark mode as default on page load
    document.body.setAttribute("data-theme", darkMode ? "dark" : "light");

    setTopic(sessionStorage.getItem("lastTopic") || "N/A");
    setScore(Number(sessionStorage.getItem("lastScore")) || 0);
    setSummary(sessionStorage.getItem("lastSummary") || "Summary not available.");
    const wrong = sessionStorage.getItem("wrongQuestions");
    if (wrong) setWrongQuestions(JSON.parse(wrong));
  }, [darkMode]);

  const handleShowExplanations = async () => {
    if (explanations.length > 0) {
      setShowExplanations(!showExplanations);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/quiz/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wrongQuestions }),
      });

      const data = await res.json();
      if (data.success) setExplanations(data.explanations);
    } catch (err) {
      console.error("Error fetching explanations:", err);
    } finally {
      setLoading(false);
      setShowExplanations(true);
    }
  };

  return (
    <div className={`result-page ${darkMode ? "dark" : ""}`}>
      <div className="result-card">
        <h2>Quiz Result</h2>
        <p>Topic: <strong>{topic}</strong></p>
        <p>Your Score: <strong>{score}</strong></p>

        <div className="summary-box">
          <h3>Summary</h3>
          <p>{summary}</p>
        </div>

        <button onClick={handleShowExplanations} className="cta-btn">
          {loading ? "Loading explanations..." : showExplanations ? "Hide Explanations" : "Show What Went Wrong"}
        </button>

        {showExplanations && explanations.length > 0 && (
          <div className="explanation-section">
            <h3>What Went Wrong</h3>
            {explanations.map((ex, i) => (
              <div key={i} className="explanation-box">
                <p><strong>Q{i + 1}: {ex.question}</strong></p>
                <p><em>{ex.explanation}</em></p>
                <hr />
              </div>
            ))}
          </div>
        )}

        <div className="result-actions">
          <button onClick={() => navigate("/landing")} className="secondary-btn">
            Try Another Quiz
          </button>
          <button onClick={() => navigate("/progress")} className="secondary-btn">
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
