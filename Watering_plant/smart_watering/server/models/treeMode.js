class Tree{
    constructor(db){
        this.DB=db;
    }
    async getAllTrees(){
        let [sql,t] = await this.DB.execute(`SELECT id FROM trees,plants WHERE id_plants = id '`);
    }

async createTree(nameTree){
    let [sql,t] = await this.DB.execute(`SELECT id FROM plants where name = '${nameTree}'`)
    console.log(sql);
    if(sql.lenght>0){
       await this.DB.execute(`INSERT INTO trees (id_plants,date) VALUE ('?','?');`,sql[0].id,new Date());
    }else{
        sql = await this.DB.execute(`INSERT INTO plants (name) VALUE ('?');`,nameTree);
        console.log(sql,insertId);
        await this.DB.execute(`INSERT INTO trees (id_plants,date) VALUE ('?','?');`,sql.insertId,new Date());
    }
}
}

module.exports = Tree;