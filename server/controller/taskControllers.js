const dbOperations = require('../module/dbOperations')

var database = new dbOperations()

const createTask = async (req, res) => {
    const { taskName, dateCreated, uuid } = req.body
    try{
        if(!taskName && !dateCreated && !uuid){
            return res.status(500).json({success: false, msg: 'body cannot be null'})
        }else{
            let query = await database.insertIntoTask(taskName, dateCreated, uuid)
            let jsonMessage = query === undefined ? {success: true, msg: 'task created', task: {taskname: taskName, datecreated: dateCreated, uuid: uuid}} : {success: false, msg: query}

            res.status(200).json(jsonMessage)
        }
    }catch(err){
        console.log(err)
    }
}

const allTasks = async (req, res) => {
    const { uuid, taskname, afterdate, beforedate } = req.query

    try{
        if(!uuid){
            res.status(404).json({msg: 'no uuid provided'})
        }
        const rows = await database.getAllTasks(uuid, taskname, afterdate, beforedate)
        res.status(200).json({uuid: uuid, rows: rows})
    }catch(err){
        console.log(err)
    }
}

const updateTask = async (req, res) => {
    try{
        const { taskid, newTaskName, uuid } = req.body
        let status = ''

        if(taskid && newTaskName && uuid){
            status = await database.updateTask(uuid, taskid, newTaskName)
            status ? res.status(200).json({success: status, newTask: {taskid, newTaskName, uuid}}) : res.status(404).json({success: status, masg: "task not found"})
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
        const taskDeleted = await database.deleteTask(uuid, taskid)

        if(taskDeleted){
            return res.status(200).json({success: taskDeleted})
        }

        res.status(404).json({success: taskDeleted, msg: "task not found"})
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