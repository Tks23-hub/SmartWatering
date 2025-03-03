import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>🌿 Smart Watering System</h1>
        <p>
          Automate plant watering with real-time sensor data & smart irrigation!
        </p>
      </header>

      <section className="info-section">
        <h2>💡 How It Works</h2>
        <p>
          Our system helps <strong>monitor and manage plant health</strong> using sensors.
          It supports different <strong>modes</strong> like
          <span className="clickable-text" onClick={() => navigate("/system-modes")}>
            {" "}automatic watering, manual control, and schedule-based watering.
          </span>
        </p>
      </section>

      <div className="navigation-options">
        <div className="option-card" onClick={() => navigate("/trees")}>
          <img src="/images/plantingTree.jpg" alt="Trees" />
          <h3>🌳 Manage Trees</h3>
          <p>View and manage all trees in the system.</p>
        </div>

        {/* <div className="option-card" onClick={() => navigate("/watering-schedule")}>
          <img src="/images/watering.png" alt="Watering" />
          <h3>💧 Watering Schedule</h3>
          <p>Check and modify plant watering schedules.</p>
        </div> */}
      </div>
    </div>
  );
}

export default Home;
