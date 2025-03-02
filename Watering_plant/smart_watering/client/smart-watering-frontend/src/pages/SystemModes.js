import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SystemModes.css"; // Create this CSS file for styling

function SystemModes() {
  const navigate = useNavigate();

  return (
    <div className="modes-container">
      <h1>⚙️ Smart Watering System Modes</h1>
      <p>Our system includes several watering modes to optimize plant care based on real-time data.</p>

      <div className="mode-card">
        <h2>📡 Automatic Mode</h2>
        <p>
          The system decides when to water based on soil moisture readings.
          <br /> If the moisture level drops below the desired range, the system activates watering.
        </p>
      </div>

      <div className="mode-card">
        <h2>⏳ Scheduled Mode</h2>
        <p>
          Users can set predefined watering times. The system will water the plants at the scheduled times, ensuring consistent hydration.
        </p>
      </div>

      <div className="mode-card">
        <h2>🔧 Manual Mode</h2>
        <p>
          Users can manually trigger watering through the web interface, giving full control over when the plants receive water.
        </p>
      </div>

      <div className="mode-card">
        <h2>🌿 Sabbath Mode</h2>
        <p>
          Designed for specific watering needs, this mode allows users to set exact watering times and durations in advance, independent of sensor data.
        </p>
      </div>

      <button className="back-button" onClick={() => navigate("/")}>⬅ Back to Home</button>
    </div>
  );
}

export default SystemModes;
