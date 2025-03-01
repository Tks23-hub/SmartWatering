class Tree{
    constructor(db){
        this.DB = db;
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
// 3 functions to get trees
// 1. getAllTrees() is to get all tree kinds
// 2. getAllTreesWithDetails() is to get all our trees 
// 3. getTreeById(treeId) is to get a tree by its own id 
    async getAllTrees() {
        try {
            let [plants] = await this.DB.execute(`
                SELECT * FROM plants
            `);
            return plants;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    async getAllTreesWithDetails() {
        try {
            let [trees] = await this.DB.execute(`
                SELECT t.id, p.name AS plant_name, t.date 
                FROM trees t
                JOIN plants p ON t.id_plants = p.id
            `);
            return trees;
        } catch (error) {
            console.error("Error fetching trees:", error);
            return [];
        }
    }
    
    async getTreeById(treeId) {
        try {
            let [tree] = await this.DB.execute(`
                SELECT t.id, p.name, t.date 
                FROM trees t
                JOIN plants p ON t.id_plants = p.id
                WHERE t.id = ?
            `, [treeId]);
            return tree.length > 0 ? tree[0] : null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////    

// this function is to create a tree 
   async createTree(nameTree){
    try {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        let [sql,t]= await this.DB.execute(`SELECT * FROM plants where name = ?`,[nameTree]);
        if(sql.length > 0){
            console.log("Plant exists. Adding to trees...");
            await this.DB.execute(`INSERT INTO trees(id_plants, date) VALUE(?,?);`, [sql[0].ID, formattedDate]);
        }else{
            sql = await this.DB.execute(`INSERT INTO plants(name) VALUE(?);`,[nameTree]);
            await this.DB.execute(`INSERT INTO trees(id_plants, date) VALUE(?,?);`,[sql.insertId, formattedDate]);
            console.log(sql);
        } 
    } catch (error) {
        console.log(error);
    }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// update function for the plant name 
    async updatePlantName(plantId, newName) {
        try {
            let [result] = await this.DB.execute(
                `UPDATE plants SET name = ? WHERE id = ?`, 
                [newName, plantId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // this function is to delete a tree from the tree lists 
    async deleteTree(treeId) {
        try {
            let [result] = await this.DB.execute(
                `DELETE FROM trees WHERE id = ?`, [treeId] 
            );
            return result.affectedRows > 0; 
        } catch (error) {
            console.error("Error deleting tree:", error);
            return false;
        }
    }
    
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = Tree;