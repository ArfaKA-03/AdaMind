import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "./QuizPage.css";

function QuizPage() {
  const { darkMode } = useContext(ThemeContext); // ✅ use ThemeContext
  const location = useLocation();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(location.state?.topic || "");
  const [quiz, setQuiz] = useState(location.state?.quiz || []);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return alert("Enter a topic first!");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        const quizWithTopic = data.quiz.map((q) => ({ ...q, topic: topic.trim() }));
        setQuiz(quizWithTopic);
      } else {
        alert("Failed to generate quiz!");
      }
    } catch (err) {
      console.error("Error generating quiz:", err);
      alert("Error generating quiz!");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (i, option) => {
    setAnswers((prev) => ({ ...prev, [i]: option }));
  };

  const handleSubmitQuiz = async () => {
    const user = JSON.parse(localStorage.getItem("quizwhizz_user"));
    if (!user?._id) {
      alert("You must be logged in to save progress.");
      return;
    }

    let correctCount = 0;
    const wrongQuestions = [];

    quiz.forEach((q, index) => {
      if (answers[index] === q.answer) correctCount++;
      else {
        wrongQuestions.push({
          question: q.question,
          selected: answers[index] || "Not answered",
          correct: q.answer,
        });
      }
    });

    sessionStorage.setItem("lastScore", String(correctCount));
    sessionStorage.setItem("lastTopic", topic.trim());
    sessionStorage.setItem("wrongQuestions", JSON.stringify(wrongQuestions));

    try {
      const response = await fetch("http://localhost:5000/api/quiz/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, topic: topic.trim(), quiz, correctCount }),
      });
      const data = await response.json();
      sessionStorage.setItem("lastSummary", data.success ? data.summary : "Failed to generate summary.");
    } catch (err) {
      console.error("Error generating summary:", err);
      sessionStorage.setItem("lastSummary", "Error generating summary.");
    }

    navigate("/result");
  };

  return (
    <div className={`quiz-container ${darkMode ? "dark" : "light"}`}>
      <h1>Quiz Generator</h1>
      <form onSubmit={handleGenerate}>
        <input
          type="text"
          placeholder="Enter topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </form>

      {quiz.length > 0 && (
        <div className="quiz-display">
          <h2>Quiz on: {topic}</h2>
          {quiz.map((q, i) => (
            <div key={i} className="question-block">
              <p>
                <strong>Q{i + 1}:</strong> {q.question}
              </p>
              {q.options.map((opt, j) => (
                <label key={j}>
                  <input
                    type="radio"
                    name={`q-${i}`}
                    value={opt}
                    checked={answers[i] === opt}
                    onChange={() => handleOptionChange(i, opt)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmitQuiz}
            disabled={Object.keys(answers).length < quiz.length}
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
}

export default QuizPage;
