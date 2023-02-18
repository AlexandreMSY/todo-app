const { Pool } = require('pg')
require('dotenv').config()

class DatabaseOperations{

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

    async insertIntoUsers(hostname, uuid){
        try{
            const client = await this.#pool.connect()
            await client.query(`INSERT INTO user_details (hostname, uuid) VALUES ('${hostname}', '${uuid}')`)
            client.release()
        } catch (err) {
            throw err
        }
    }

    async insertIntoTask(taskName, date, uuid) {
        const text = `INSERT INTO task (task_name, date_created, uuid) VALUES ('${taskName}', '${date}', '${uuid}')`
        try{
            const client = await this.#pool.connect()
            await client.query(text)
            client.release()
            console.log(text)
        }catch(err){
            throw err
        }
    }

    async getAllTasks(uuid, taskName, afterDate, beforeDate){
        let text = `SELECT task_name, date_created, task_id FROM task WHERE uuid = '${uuid}'`
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
            throw err
        }
    }

    async #taskExists(uuid, taskId){
        const text = `SELECT task_id, task_name, date_created FROM task WHERE task_id = ${taskId} AND uuid = '${uuid}'`

        try{
            const client = await this.#pool.connect()
            const {rows} = await client.query(text)
            client.release()

            //console.log(rows)

            return rows.length > 0 ? true : false
        }catch(err){
            throw err
        }
    }

    async updateTask(uuid, taskId, newTaskName){
        const text = `UPDATE task SET task_name = '${newTaskName}' WHERE task_id = ${taskId} AND uuid = '${uuid}'`

        try{
            const taskExists = await this.#taskExists(uuid, taskId)
            
            if(taskExists){
                const client = await this.#pool.connect()
                await client.query(text)
                client.release()

                return true
            }else{
                return false
            }
        }catch (err){
            throw err
        }
    }

    async deleteTask(uuid, taskId){
        const text = `DELETE FROM task WHERE task_id = ${taskId} AND uuid = '${uuid}'`

        try{
            const taskExists = await this.#taskExists(uuid, taskId)
            
            if(taskExists){
                const client = await this.#pool.connect()
                await client.query(text)
                client.release()

                return true
            }else{
                return false
            }
        }catch(err){
            throw err
        }
    }

}

module.exports = DatabaseOperations
