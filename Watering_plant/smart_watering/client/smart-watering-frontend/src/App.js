import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Trees from "./pages/Trees";
import WateringSchedule from "./pages/WateringSchedule";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SystemModes from "./pages/SystemModes";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trees" element={<Trees />} />
        <Route path="/watering-schedule" element={<WateringSchedule />} />
        <Route path="/system-modes" element={<SystemModes />} /> 
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
