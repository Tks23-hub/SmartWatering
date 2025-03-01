import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";


function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/trees">Trees</Link></li>
        <li><Link to="/watering-schedule">Watering Schedule</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
