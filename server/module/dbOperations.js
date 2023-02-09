const { Pool } = require('pg')
require('dotenv').config()

/*var pool = new Pool({
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
})*/


class DatabaseOperations{

    /*constructor(uuid){
        this.#uuid = uuid
    }

    constructor(){}*/

    #uuid = ''
    #pool = new Pool({
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD
    })

    setUuid (uuid) {
        this.#uuid = uuid
    } 

    getUuid () {
        return this.#uuid
    }

    async insertIntoUsers(hostname){
        try{
            const client = await this.#pool.connect()
            await client.query(`INSERT INTO user_details (hostname, uuid) VALUES ('${hostname}', '${this.#uuid}')`)
            client.release()
        } catch (err) {
            return err.detail
        }
    }

    async insertIntoTask(taskName, date) {
        const text = `INSERT INTO task (task_name, date_created, uuid) VALUES ('${taskName}', '${date}', '${this.#uuid}')`
        try{
            const client = await this.#pool.connect()
            await client.query(text)
            client.release()
        }catch(err){
            return err.detail
        }
    }

    async getAllTasks(taskName, afterDate, beforeDate){
        let text = `SELECT task_name, date_created FROM task WHERE uuid = '${this.#uuid}'`
        let query = "";
        
        if(taskName && (!afterDate || !beforeDate)){
            query = ` AND task_name ILIKE '%${taskName}%'`
            text = text + query
        }else if (taskName && (afterDate || beforeDate)){
            query = ` AND task_name ILIKE '%${taskName}%' AND ${afterDate ? `date_created > '${afterDate}'` : `date_created < '${beforeDate}'`}`
            text = text + query
        }else if (!taskName && (afterDate || beforeDate)){
            query = ` AND ${afterDate ? `date_created > '${afterDate}'` : `date_created < '${beforeDate}'`}`
            text = text + query
        }

        console.log(text)

        try{
            const client = await this.#pool.connect()
            const {rows} = await client.query(text)
            client.release()

            return rows
        }catch(err){
            return err.detail
        }
    }

    async updateTask(taskId, newTaskName, uuid){
        const text = `UPDATE task SET task_name = '${newTaskName}' WHERE task_id = ${taskId} AND uuid = '${uuid}'`
        const verifyTask = `SELECT task_id, task_name, date_created FROM task WHERE task_id = ${taskId} AND uuid = '${uuid}'`

        try{
            const client = await this.#pool.connect()
            const {rows} = await client.query(verifyTask)

            console.log(rows)

            if(rows.length > 0){
                await client.query(text)
                client.release()
                let taskId = rows[0].task_id
                return `updated task id ${taskId}`
            }else{
                client.release()
                return 'No Tasks Found'
            }
            
        }catch (err){
            console.log(err)
        }
    }


}

module.exports = DatabaseOperations
