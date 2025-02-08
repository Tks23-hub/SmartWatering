const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    const { temp, light, moisture } = req.query;
    let sensorData = JSON.parse(fs.readFileSync("sensor_data.json", "utf8") || '{"records":[]}');
    sensorData.records.push({
        temp: parseFloat(temp),
        light: parseInt(light),
        moisture: parseInt(moisture),
        timestamp: new Date().toISOString()
    });
    fs.writeFileSync("sensor_data.json", JSON.stringify(sensorData, null, 2));
    res.json({ message: "Data received successfully" });
});

router.get('/state', (req, res) => {
    let data = JSON.parse(fs.readFileSync("Inside_information.json", "utf8"));
    data.date = new Date().getHours();
    res.json(data);
});

router.get('/dataMode', (req, res) => {
    const { state } = req.query;
    let data = JSON.parse(fs.readFileSync("Inside_information.json", "utf8"));
    res.json(data[state]);
});

module.exports = router;
