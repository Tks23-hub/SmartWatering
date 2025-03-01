import React, { useEffect, useState } from "react";
import "../styles/Watering.css"; 

function WateringSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [plantID, setPlantID] = useState("");
  const [waterTime, setWaterTime] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/watering")
      .then((res) => res.json())
      .then((data) => setSchedules(data))
      .catch((error) => console.error("Error fetching schedule:", error));
  }, []);

  const handleAddSchedule = (e) => {
    e.preventDefault();
    fetch("http://localhost:3001/watering/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plantID, waterTime, duration }),
    })
      .then((res) => res.json())
      .then(() => {
        setPlantID("");
        setWaterTime("");
        setDuration("");
        return fetch("http://localhost:3001/watering");
      })
      .then((res) => res.json())
      .then((data) => setSchedules(data))
      .catch((error) => console.error("Error adding schedule:", error));
  };

  const handleDeleteSchedule = (id) => {
    fetch(`http://localhost:3001/watering/delete/${id}`, {
      method: "DELETE",
    })
      .then(() => fetch("http://localhost:3001/watering"))
      .then((res) => res.json())
      .then((data) => setSchedules(data))
      .catch((error) => console.error("Error deleting schedule:", error));
  };

  return (
    <div className="container">
      <h1>💧 Watering Schedule</h1>

      <form onSubmit={handleAddSchedule} className="form-container">
        <input
          type="number"
          placeholder="🌱 Plant ID"
          value={plantID}
          onChange={(e) => setPlantID(e.target.value)}
          required
        />
        <input
          type="time"
          value={waterTime}
          onChange={(e) => setWaterTime(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="⏳ Duration (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
        <button type="submit" className="btn-add">➕ Add Schedule</button>
      </form>

      <ul>
        {schedules.length > 0 ? (
          schedules.map((schedule) => (
            <li key={schedule.id} className="schedule-item">
              <span>
                🌱 <strong>Plant ID:</strong> {schedule.plant_id} | 🕒 <strong>Time:</strong> {schedule.water_time} | ⏳ <strong>Duration:</strong> {schedule.duration} min
              </span>
              <button className="btn-delete" onClick={() => handleDeleteSchedule(schedule.id)}>❌ Delete</button>
            </li>
          ))
        ) : (
          <p className="no-data">📭 No watering schedules available.</p>
        )}
      </ul>
    </div>
  );
}

export default WateringSchedule;
