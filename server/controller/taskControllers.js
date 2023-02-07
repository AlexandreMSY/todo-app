const dbOperations = require('../module/dbOperations')

var database = new dbOperations()

const createTask = async (req, res) => {
    const { taskName, dateCreated, uuid} = req.body
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
    database.setUuid(cookieUuid)
    const rows = await database.getAllTasks()
    res.status(200).json({uuid: cookieUuid, rows: rows})
}



module.exports = {
    createTask,
    allTasks
}