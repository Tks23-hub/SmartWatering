const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
const HTTP_PORT = 3001;

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const treeRoutes = require("./routes/treeRoute");
const espRoutes = require('./routes/esp');
const wateringRoutes = require("./routes/wateringRoute");

// Log the imported modules
console.log("Tree Routes:", treeRoutes);
console.log("ESP Routes:", espRoutes);
console.log("Watering Routes:", wateringRoutes);

// Use the routes
app.use("/tree", treeRoutes);
app.use("/esp", espRoutes);
app.use("/watering", wateringRoutes);

app.listen(HTTP_PORT, () => {
    console.log(`The server is running on port: ${HTTP_PORT} \nlink: http://localhost:${HTTP_PORT}`);
});
