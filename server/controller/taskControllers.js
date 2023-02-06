const { insertIntoTask } = require('../module/dbOperations')

const createTask = (req, res) => {
    const { taskName, dateCreated, uuid} = req.body

    if(!taskName && !dateCreated && !uuid){
        //console.log(taskName + " " + dateCreated + " " + uuid)
        return res.status(500).json({success: false, msg: 'body cannot be null'})
    }else{
        //console.log(taskName + " " + dateCreated + " " + uuid)

        insertIntoTask(taskName, dateCreated, uuid)

        res.status(200).json({success: true, msg: 'task created'})
    }

    console.log(req.body)
}

module.exports = {
    createTask
}