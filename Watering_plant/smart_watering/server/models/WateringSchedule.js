class WateringSchedule {
    constructor(db) {
        this.DB = db;
    }

    async createSchedule(plantID, waterTime, duration) {
        try {
            await this.DB.execute(
                `INSERT INTO watering_schedule (plant_id, water_time, duration) VALUES (?, ?, ?)`,
                [plantID, waterTime, duration]
            );
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async getSchedule(plantID) {
        try {
            let [rows] = await this.DB.execute(
                `SELECT * FROM watering_schedule WHERE plant_id = ?`,
                [plantID]
            );
            return rows;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async updateSchedule(scheduleID, waterTime, duration) {
        try {
            let [result] = await this.DB.execute(
                `UPDATE watering_schedule SET water_time = ?, duration = ? WHERE id = ?`,
                [waterTime, duration, scheduleID]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    async deleteSchedule(scheduleID) {
        try {
            let [result] = await this.DB.execute(
                `DELETE FROM watering_schedule WHERE id = ?`, 
                [scheduleID]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}


module.exports = WateringSchedule;
