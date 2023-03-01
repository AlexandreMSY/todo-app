const express = require('express')
const router = express.Router()
const { createTask, allTasks, updateTask, deleteTask } = require('../controller/taskControllers')

router.get('/alltasks/:uuid?/:taskName?/:afterdate?/:beforedate?', allTasks)
router.post('/createTask', createTask)
router.put('/updateTask', updateTask)
router.delete('/deleteTask', deleteTask)

module.exports = router
