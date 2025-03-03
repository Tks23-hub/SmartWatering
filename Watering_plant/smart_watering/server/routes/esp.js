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

       
        const waterTime = new Date().toISOString().split('T')[1].slice(0, 8); 
        const duration = waterUsed / 200;

        await db.execute(`
            INSERT INTO watering_schedule (plant_id, water_time, duration) 
            VALUES (?, ?, ?)
        `, [plantID, waterTime, duration]);

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

router.get('/watering-history', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT ws.plant_id, ws.water_time, ws.duration, p.name AS plant_name
            FROM watering_schedule ws
            JOIN plants p ON ws.plant_id = p.ID
            ORDER BY ws.water_time DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error retrieving watering history:", error);
        res.status(500).json({ error: "Error retrieving watering history" });
    }
});


module.exports = router;
