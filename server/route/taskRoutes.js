const express = require('express')
const router = express.Router()
const { createTask } = require('../controller/taskControllers')

router.post('/createTask', createTask)

module.exports = router
