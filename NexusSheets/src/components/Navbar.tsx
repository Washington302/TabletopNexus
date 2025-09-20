import "./Navbar.css";

import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-logo">NexusSheets</span>
      </div>
      <button className="navbar-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle navigation">
        <span className="navbar-toggle-icon">☰</span>
      </button>
      <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link to="/games" onClick={() => setMenuOpen(false)}>Games</Link>
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
      </div>
      <div className="navbar-account">
        <Link to="/dashboard">
          <button>Account</button>
        </Link>
      </div>
    </nav>
  );
};


export default Navbar;
