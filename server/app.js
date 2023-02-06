const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const authRoutes = require('./route/authRoutes')
const taskRoutes = require('./route/taskRoutes')

const corsOptions = {
    origin: true,
    exposedHeaders: ['SET-COOKIE'],
    credentials: true
}

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/auth', authRoutes)
app.use('/task', taskRoutes)

app.listen(5000, () => {
    console.log('Connected')
})