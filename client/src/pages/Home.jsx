// src/pages/Home.jsx
import React from "react";
import "./Home.css";
import { FaLightbulb, FaChartLine, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import aiImage from "../assets/fp.jpg";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Personal <br /> AI Study Partner</h1>
          <p>AI-powered quizzes and flashcards tailored just for you. Master any subject with ease.</p>
          <button className="cta-btn" onClick={() => navigate("/signup")}>Get Started</button>
        </div>
        <div className="hero-image">
          <img src={aiImage} alt="AI graphic" />
        </div>
      </section>

      {/* Learn Section */}
      <section className="learn-section">
        <h2>Learn Smarter, Not Harder</h2>
        <p>AdaMind uses AI to create a unique learning experience that adapts to your needs, helping you focus on what matters most.</p>

        <div className="feature-grid">
          <div className="feature-card">
            <FaLightbulb className="icon" />
            <h3>Personalized Quizzes</h3>
            <p>Create tailored quizzes instantly based on your input.</p>

          </div>
          <div className="feature-card">
            <FaBook className="icon" />
            <h3>Flashcards Geneartion</h3>
            <p>Automatically turn your mistakes into smart flashcards to reinforce weak spots.</p>
          </div>
          <div className="feature-card">
            <FaChartLine className="icon" />
            <h3>Progress Tracking</h3>
            <p>Visualize your learning journey, track your mastery, and identify your strengths.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
