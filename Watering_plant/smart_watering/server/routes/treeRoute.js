const express = require('express');
const router = express.Router();
const Tree  = require('../models/treeMode');
const db = require('../models/database');

const tree = new Tree(db);

router.post("/add", (req, res) => {
    try {
        const { name } = req.body;
        tree.createTree(name);
        res.status(201).json({message: "ctreate tree success"});

    } catch (error) {
       console.log(error);
    }
   
});


module.exports = router;