import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { ThemeContext } from "../context/ThemeContext";
import logoImg from "../assets/logo.jpg";

function Navbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("quizwhizz_user"));
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  const handleLogoutClick = () => {
    localStorage.removeItem("quizwhizz_user");
    if (onLogout) onLogout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logoImg} alt="AdaMind Logo" className="logo-img" />
        <span>AdaMind</span>
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
                  <button
                    onClick={() => {
                      navigate("/flashcardsprogress");
                      setMenuOpen(false);
                    }}
                  >
                    💾 Saved Flashcards
                  </button>

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
  );
}

export default Navbar;
