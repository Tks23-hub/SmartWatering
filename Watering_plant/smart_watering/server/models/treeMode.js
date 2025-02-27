class Tree{
    constructor(db){
        this.DB = db;
    }

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

   async createTree(nameTree){
    try {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        let [sql,t]= await this.DB.execute(`SELECT * FROM plants where name = ?`,[nameTree]);
        if(sql.length > 0){
            await this.DB.execute(`INSERT INTO trees(id_plants, date) VALUE(?,?);`,[sql[0].id, formattedDate]);
        }else{
            sql = await this.DB.execute(`INSERT INTO plants(name) VALUE(?);`,[nameTree]);
            await this.DB.execute(`INSERT INTO trees(id_plants, date) VALUE(?,?);`,[sql.insertId, formattedDate]);
            console.log(sql);
        } 
    } catch (error) {
        console.log(error);
    }
    }

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
    
    async deletePlant(plantId) {
        try {
            let [result] = await this.DB.execute(
                `DELETE FROM plants WHERE id = ?`, [plantId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}



module.exports = Tree;