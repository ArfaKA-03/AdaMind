import React, { useEffect, useState } from "react";
import "./Progress.css";

function Progress() {
  const [progress, setProgress] = useState([]);
  const [theme, setTheme] = useState("dark");
  const user = JSON.parse(localStorage.getItem("quizwhizz_user"));

  useEffect(() => {
    document.body.className = theme === "light" ? "light-theme" : "";
  }, [theme]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchProgress = async () => {
      try {
        // ✅ Backend route that returns user progress
        const res = await fetch(`/api/quiz/user/${user._id}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.user.progress)) {
          const sortedProgress = [...data.user.progress].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          setProgress(sortedProgress);
        }
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchProgress();
  }, [user]);

  if (!user) return <p className="login-message">Please log in to view your progress.</p>;

  return (
    <div className="progress-container">
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px 14px",
          backgroundColor: "var(--accent-color)",
          border: "none",
          borderRadius: "8px",
          color: "#000",
          cursor: "pointer",
        }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      {/* ✅ Removed “Quiz Progress” text here */}
      <h2 className="progress-title">{user?.name || "User"}</h2>

      {progress.length === 0 ? (
        <p className="no-data">No quizzes attempted yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="progress-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {progress.map((p, i) => (
                <tr key={i}>
                  <td>{p.topic || "Untitled"}</td>
                  <td>{p.score ?? "N/A"}</td>
                  <td>{p.date ? new Date(p.date).toLocaleString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Progress;
