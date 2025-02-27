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

const tree = require("./routes/treeRout");
app.use("/tree", tree);

const esp = require('./routes/esp');
app.use('/esp', esp);

app.listen(HTTP_PORT, () => {
    console.log(`The server is running on port: ${HTTP_PORT} \nlink: http://localhost:${HTTP_PORT}`);
});

