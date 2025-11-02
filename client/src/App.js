// src/App.js
import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import Flashcards from "./pages/Flashcards";
import Progress from "./pages/Progress";
import LoginPage from "./pages/Login";
import Signup from "./pages/Signup";
import LandingPage from "./pages/LandingPage";
import { ThemeContext } from "./context/ThemeContext"; // ✅ import ThemeContext
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("quizwhizz_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const { darkMode } = useContext(ThemeContext); // ✅ access theme context

  // ✅ Apply theme class to <body>
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
  }, [darkMode]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("quizwhizz_user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("quizwhizz_user");
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/signup"
            element={<Signup onSignupSuccess={handleLoginSuccess} />}
          />

          {user ? (
            <>
              <Route path="/landing" element={<LandingPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/progress" element={<Progress />} />
            </>
          ) : (
            <>
              <Route
                path="/landing"
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path="/quiz"
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path="/result"
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path="/flashcards"
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path="/progress"
                element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
              />
            </>
          )}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
