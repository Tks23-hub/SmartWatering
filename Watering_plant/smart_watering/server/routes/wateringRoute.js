const express = require('express');
const router = express.Router();
const WateringSchedule = require("../models/WateringSchedule");
const db = require('../models/database');

const watering = new WateringSchedule(db);

router.post("/add", async (req, res) => {
    try {
        const { plantID, waterTime, duration } = req.body;
        await watering.createSchedule(plantID, waterTime, duration);
        res.status(201).json({ message: "Watering schedule created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create watering schedule" });
    }
});

router.get("/:plantID", async (req, res) => {
    try {
        const plantID = req.params.plantID;
        const schedule = await watering.getSchedule(plantID);
        res.json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch watering schedule" });
    }
});

router.put("/update/:scheduleID", async (req, res) => {
    try {
        const scheduleID = req.params.scheduleID;
        const { waterTime, duration } = req.body;
        await watering.updateSchedule(scheduleID, waterTime, duration);
        res.json({ message: "Watering schedule updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update watering schedule" });
    }
});

router.delete("/delete/:scheduleID", async (req, res) => {
    try {
        const scheduleID = req.params.scheduleID;
        await watering.deleteSchedule(scheduleID);
        res.json({ message: "Watering schedule deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete watering schedule" });
    }
});

module.exports = router;  // ✅ Ensure the correct export
