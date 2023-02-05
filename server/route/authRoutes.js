const express = require('express')
const router = express.Router()
const { createUsers } = require('../controller/authControllers')

router.post('/createuser', createUsers)

module.exports = router