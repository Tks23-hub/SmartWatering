import React, { useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav>
      <div className="navbar-container">
        <div className="logo">Smart Watering</div>
        
        <div className="nav-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><a href="/">Home</a></li>
          <li><a href="/trees">Trees</a></li>
          <li><a href="/watering-history">watering-history</a></li>
          {/* <li><a href="/watering-schedule">Watering Schedule</a></li> */}
          {/* <li><a href="/about">About</a></li> */}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
