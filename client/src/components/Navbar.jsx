// src/components/Navbar.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { ThemeContext } from "../context/ThemeContext";

function Navbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showFlashcardsModal, setShowFlashcardsModal] = useState(false);
  const [savedFlashcards, setSavedFlashcards] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("quizwhizz_user"));
  const { darkMode, toggleTheme } = useContext(ThemeContext); // ✅ use global theme

  const handleLogoutClick = () => {
    localStorage.removeItem("quizwhizz_user");
    if (onLogout) onLogout();
    setMenuOpen(false);
    navigate("/");
  };

  const fetchSavedFlashcards = async () => {
    if (!user?._id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/quiz/user/${user._id}`);
      const data = await res.json();
      if (data.success && data.user.flashcards?.length > 0) {
        setSavedFlashcards(data.user.flashcards.reverse());
      } else {
        setSavedFlashcards([]);
      }
    } catch (err) {
      console.error("Error fetching flashcards:", err);
    }
  };

  const handleShowFlashcards = async () => {
    await fetchSavedFlashcards();
    setShowFlashcardsModal(true);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          QuizWhizz
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>

          {user ? (
            <>
              <li><Link to="/landing">Generate Quiz</Link></li>
              <li><Link to="/flashcards">Flashcards</Link></li>

              <div className="profile-container">
                <div
                  className="profile-circle"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="Profile"
                      className="profile-image"
                    />
                  ) : (
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      alt="Default User"
                      className="profile-default"
                    />
                  )}
                </div>

                {menuOpen && (
                  <div className="dropdown-menu">
                    <button
                      onClick={() => {
                        navigate("/progress");
                        setMenuOpen(false);
                      }}
                    >
                      📈 Progress
                    </button>

                    <button onClick={handleShowFlashcards}>
                      💾 Saved Flashcards
                    </button>

                    {/* ✅ Global Theme Toggle */}
                    <button onClick={toggleTheme}>
                      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                    </button>

                    <button onClick={handleLogoutClick}>🚪 Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </nav>

      {/* Full-Screen Flashcards Modal */}
      {showFlashcardsModal && (
        <div className="flashcards-fullscreen">
          <div className="flashcards-header">
            <h2>💾 Saved Flashcards</h2>
            <button
              className="back-btn"
              onClick={() => setShowFlashcardsModal(false)}
            >
              ← Back
            </button>
          </div>

          {savedFlashcards.length === 0 ? (
            <p>No saved flashcards found.</p>
          ) : (
            savedFlashcards.map((set, i) => (
              <div key={i} className="flashcard-topic-section">
                <h3 className="flashcard-topic">{set.topic}</h3>
                <small className="flashcard-date">
                  {new Date(set.date).toLocaleString()}
                </small>
                <div className="flashcard-grid">
                  {set.data.map((f, j) => (
                    <div key={j} className="flashcard-box">
                      <h4 className="flashcard-question">{f.question}</h4>
                      <p className="flashcard-answer">{f.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default Navbar;
