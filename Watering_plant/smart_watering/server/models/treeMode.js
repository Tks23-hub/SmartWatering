class Tree{
    constructor(db){
        this.DB = db;
    }

    async getAllTree(){
       let [sql,t]= await this.DB.execute(`SELECT * FROM threes,plants WHERE id_plants = id`);
    }

   async createTree(nameTree){
    try {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        let [sql,t]= await this.DB.execute(`SELECT * FROM plants where name = ?`,[nameTree]);
        if(sql.length > 0){
            await this.DB.execute(`INSERT INTO threes(id_plants, date) VALUE(?,?);`,[sql[0].id, formattedDate]);
        }else{
            sql = await this.DB.execute(`INSERT INTO plants(name) VALUE(?);`,[nameTree]);
            await this.DB.execute(`INSERT INTO threes(id_plants, date) VALUE(?,?);`,[sql.insertId, formattedDate]);
            console.log(sql);
        } 
    } catch (error) {
        console.log(error);
    }
    
    
    }

}

module.exports = Tree;