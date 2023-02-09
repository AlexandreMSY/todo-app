const dbOperations = require('../module/dbOperations')

var database = new dbOperations()

const createTask = async (req, res) => {
    const { taskName, dateCreated, uuid } = req.body
    database.setUuid(uuid)
    console.log(database.getUuid())

    if(!taskName && !dateCreated && !uuid){
        return res.status(500).json({success: false, msg: 'body cannot be null'})
    }else{
        let query = await database.insertIntoTask(taskName, dateCreated)
        let jsonMessage = query === undefined ? {success: true, msg: 'task created'} : {success: false, msg: query}

        res.status(200).json(jsonMessage)
    }
}

const allTasks = async (req, res) => {
    const cookieUuid = req.cookies.user
    const { uuid } = req.body
    const { taskname, afterdate, beforedate } = req.query

    database.setUuid(uuid)
    try{
        const rows = await database.getAllTasks(taskname, afterdate, beforedate)
        res.status(200).json({uuid: uuid, rows: rows})
    }catch(err){
        console.log(err)
    }
}

const updateTask = async (req, res) => {
    const { taskid, newTaskName, uuid } = req.body
    let status = ''

    if(taskid && newTaskName && uuid){
        status = await database.updateTask(taskid, newTaskName, uuid)
        res.status(200).json({success: true, msg: status})
    }else{
        res.json({success: false, msg: 'missing info'})
    }
}


module.exports = {
    createTask,
    allTasks,
    updateTask
}