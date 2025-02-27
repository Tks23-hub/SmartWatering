const express = require('express');
const router = express.Router();
const Tree = require('../models/treeMode');
const db = require('../models/database');

const tree = new Tree(db);


router.post("/add", async (req, res) => {
    try {
        const { name } = req.body;
        await tree.createTree(name);
        res.status(201).json({ message: "Tree created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error creating tree" });
    }
});


router.get("/", async (req, res) => {
    try {
        const trees = await tree.getAllTrees();
        res.json(trees);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving trees" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const treeId = req.params.id;
        const foundTree = await tree.getTreeById(treeId);
        if (foundTree) {
            res.json(foundTree);
        } else {
            res.status(404).json({ error: "Tree not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error retrieving tree" });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const treeId = req.params.id;
        const { newDate } = req.body;
        const updated = await tree.updateTree(treeId, newDate);
        if (updated) {
            res.json({ message: "Tree updated successfully" });
        } else {
            res.status(404).json({ error: "Tree not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error updating tree" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const treeId = req.params.id;
        const deleted = await tree.deleteTree(treeId);
        if (deleted) {
            res.json({ message: "Tree deleted successfully" });
        } else {
            res.status(404).json({ error: "Tree not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error deleting tree" });
    }
});

module.exports = router;
