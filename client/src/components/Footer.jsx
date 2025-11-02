import React from "react";
import { Link } from "react-router-dom"; // ✅ Use React Router
import "./Footer.css";

function Footer() {

  return (
    <footer>
      <div className="footer-links">
        <Link to="/about">About Us</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <p>© 2024 QuizWhizz. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
