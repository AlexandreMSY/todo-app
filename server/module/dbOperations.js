const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
})

const insertIntoUsers = async (hostname, uuid) => {
    try{
        const client = await pool.connect()
        client.query(`INSERT INTO user_details (hostname, uuid) VALUES ('${hostname}', '${uuid}')`)
        client.release()
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    insertIntoUsers
}