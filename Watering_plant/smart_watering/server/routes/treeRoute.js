const express = require('express');
const router = express.Router();
const Tree = require('../models/treeMode');
const db = require('../models/database');

const tree = new Tree(db);

// a path to add a new tree 
router.post("/add", async (req, res) => {
    try {
        const { name, date } = req.body; 
        await tree.createTree(name, date);
        res.status(201).json({ message: "Tree created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error creating tree" });
    }
});
// 3 get paths 
// 1. to get all trees from trees table 
// 2. get all plants which is the kind of plants
// 3. get a tree by id 
router.get("/all", async (req, res) => {
    try {
        const trees = await tree.getAllTreesWithDetails();
        res.json(trees);
    } catch (error) {
        res.status(500).json({ error: "Error retrieving trees" });
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////


// 2 paths for updating
// 1.update the date when we added the plant in trees table 
// 2. update the name of the plant in plant table
router.put("/:id", async (req, res) => {
    try {
        const treeId = req.params.id;
        const { newDate } = req.body;
        
        const updated = await tree.updateTree(treeId, newDate); 
        if (updated) {
            res.json({ message: "Tree updated successfully" });
        } else {
            res.status(404).json({ error: "Tree not found or date is the same" });
        }
    } catch (error) {
        console.error("Error in updateTree route:", error);
        res.status(500).json({ error: "Error updating tree" });
    }
});

router.put("/plant/:id", async (req, res) => {
    try {
        const plantId = req.params.id;
        const { newName } = req.body;
        
        const updated = await tree.updatePlantName(plantId, newName);  
        if (updated) {
            res.json({ message: "Plant name updated successfully" });
        } else {
            res.status(404).json({ error: "Plant not found or name is the same" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error updating plant name" });
    }
});



// a path to delete a tree by id 
router.delete("/:id", async (req, res) => {
    try {
        const treeId = req.params.id;
        const deleted = await tree.deleteTree(treeId); 
        if (deleted) {
            res.json({ message: "Tree deleted successfully" });
        } else {
            res.status(404).json({ error: "Tree not found or already deleted" });
        }
    } catch (error) {
        console.error("Error in deleteTree route:", error);
        res.status(500).json({ error: "Error deleting tree" });
    }
});


module.exports = router;
