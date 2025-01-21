const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    console.log("hello my ESP");
})

module.exports = router;