const express = require('express')
const router = express.Router()
const { createTask, allTasks } = require('../controller/taskControllers')

router.get('/alltasks/:taskName?/:afterdate?/:beforedate?', allTasks)
router.post('/createTask', createTask)

module.exports = router
