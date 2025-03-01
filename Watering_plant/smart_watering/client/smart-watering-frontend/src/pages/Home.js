import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* 🔥 Website Intro */}
      <header className="hero-section">
        <h1>🌿 Smart Watering System</h1>
        <p>
          Automate plant watering with real-time sensor data & smart irrigation!
        </p>
      </header>

      {/* 📖 Explanation Sections */}
      <section className="info-section">
        <h2>💡 How It Works</h2>
        <p>
          Our system helps **monitor and manage plant health** using sensors.
          It supports different **modes** like **automatic watering, manual control, and schedule-based watering.**
        </p>
      </section>

      <section className="mode-explanation">
        <h3>⚙️ System Modes:</h3>
        <ul>
          <li>📡 **Automatic Mode**   <br></br>Sensors decide when to water based on soil moisture.</li>
          <li>⏳ **Scheduled Mode**  Set specific watering times per plant.</li>
          <li>🔧 **Manual Mode**  Choose when to water manually.</li>
          <li>🌿 **Sabbath Mode**  <br></br>Special mode for scheduled watering on specific days.</li>
        </ul>
      </section>

      {/* 📌 Navigation Buttons */}
      <div className="navigation-options">
        <div className="option-card" onClick={() => navigate("/trees")}>
          <img src="/images/trees.png" alt="Trees" />
          <h3>🌳 Manage Trees</h3>
          <p>View and manage all trees in the system.</p>
        </div>

        <div className="option-card" onClick={() => navigate("/watering-schedule")}>
  <img src="/images/watering.png" alt="Watering" />
  <h3>💧 Watering Schedule</h3>
  <p>Check and modify plant watering schedules.</p>
</div>

      </div>
    </div>
  );
}

export default Home;
