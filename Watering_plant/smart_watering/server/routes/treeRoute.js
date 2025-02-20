const express = require('express');
const Tree = require('../models/treeMoode');
const db = require ('../models/database');
const router = require('./esp');

const tree = new Tree(db);

router.post("/add",(req,res)=>{
    try {
       const { name } = req.body;
       tree.createTree(name);
       res.status(201).json({message:"A new tree has been created"})
    }catch (error){
        console.log(error);  
    }
    
});
module.exports = router;
