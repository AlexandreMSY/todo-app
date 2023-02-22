const db = require('../module/dbOperations')
const { Pool } = require('pg')
require('dotenv').config()

const createTask = async (req, res) => {
    const { taskName, dateCreated, uuid } = req.body
    const text = `INSERT INTO task (task_name, date_created, uuid) VALUES ('${taskName}', '${dateCreated}', '${uuid}')`

    try{
        if(!taskName && !dateCreated && !uuid){
            return res.status(500).json({success: false, msg: 'body cannot be null'})
        }else{
            db.query(text)
            let jsonMessage = {success: true, msg: 'task created', task: {taskname: taskName, datecreated: dateCreated, uuid: uuid}}
            res.status(200).json(jsonMessage)
        }
    }catch(err){
        console.log(err)
    }
}

const allTasks = async (req, res) => {
    const { uuid, taskname, afterdate, beforedate } = req.query
    let text = `SELECT task_name, date_created, task_id FROM task WHERE uuid = '${uuid}'`
    let queryText = "";
        
    if(taskname && (!afterdate || !beforedate)){
        queryText = ` AND task_name ILIKE '%${taskname}%'`
        text = text + queryText
    }else if (taskname && (afterdate || beforedate)){
        queryText = ` AND task_name ILIKE '%${taskname}%' AND ${afterdate ? `date_created > '${afterdate}'` : `date_created < '${beforedate}'`}`
        text = text + queryText
    }else if (!taskname && (afterdate || beforedate)){
        queryText = ` AND ${afterdate ? `date_created > '${afterdate}'` : `date_created < '${beforedate}'`}`
        text = text + queryText
    }

    try{
        if(!uuid){
            res.status(404).json({msg: 'no uuid provided'})
        }
        const {rows} = await db.query(text)
        res.status(200).json({uuid: uuid, rows: rows})
    }catch(err){
        console.log(err)
    }
}

const updateTask = async (req, res) => {
    try{
        const { taskId, newTaskName, uuid } = req.body
        let status = ''

        if(taskId && newTaskName && uuid){
            status = await db.query(`UPDATE task SET task_name = '${newTaskName}' WHERE task_id = ${taskId} AND uuid = '${uuid}'`)

            res.status(200).json({success: status, newTask: {taskid, newTaskName, uuid}})
        }else{
            res.json({success: false, msg: 'missing info'})
        }
    }catch(err){
        return err
    }
}

const deleteTask = async (req, res) => {
    try{
        const { uuid, taskid } = req.body
        const text = `DELETE FROM task WHERE task_id = ${taskid} AND uuid = '${uuid}'`
        const status = await db.query(text)

        if(status.rowCount === 0){
            res.status(404).json({success: false, msg: "task not found"})
        }

        res.status(200).json({success: true, msg: "ok!"})
    }catch(err){
        return err
    }
}

module.exports = {
    createTask,
    allTasks,
    updateTask,
    deleteTask
}