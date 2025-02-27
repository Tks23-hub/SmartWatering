const express = require('express');
const router = express.Router();
const fs = require('fs');
const db = require('../models/database'); 


router.post('/', async (req, res) => {
    try {
        const { temp, light, moisture, plantID, waterUsed } = req.body;

        if (!temp || !light || !moisture || !plantID || waterUsed === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        await db.execute(`
            INSERT INTO sensor_data (plant_id, temperature, light, moisture, water_used, timestamp) 
            VALUES (?, ?, ?, ?, ?, NOW())
        `, [plantID, temp, light, moisture, waterUsed]);

        console.log(`Data received: Temp=${temp}, Light=${light}, Moisture=${moisture}, Plant=${plantID}, WaterUsed=${waterUsed}`);
        res.json({ message: "Data received and saved to MySQL" });

    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get('/state', (req, res) => {
    try {
        let data = JSON.parse(fs.readFileSync("Inside_information.json", "utf8"));
        data.date = new Date().getHours();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Could not read state data" });
    }
});


router.get('/dataMode', (req, res) => {
    try {
        const { state } = req.query;
        let data = JSON.parse(fs.readFileSync("Inside_information.json", "utf8"));
        res.json(data[state]);
    } catch (error) {
        res.status(500).json({ error: "Could not read mode data" });
    }
});

module.exports = router;
