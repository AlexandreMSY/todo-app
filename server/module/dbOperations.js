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

    async getAllTasks(){
        const text = `SELECT task_name, date_created, uuid FROM task`
        try{
            const client = await this.#pool.connect()
            const {rows} = await client.query(text)
            client.release()

            return rows
        }catch(err){
            return err.detail
        }
    }

}

module.exports = DatabaseOperations
