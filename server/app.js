const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const cors = require('cors')

const authRoutes = require('./route/authRoutes')

const corsOptions = {
    origin: true,
    exposedHeaders: ['SET-COOKIE'],
    credentials: true
}

app.use(cookieParser())
app.use(cors(corsOptions))

app.use('/auth', authRoutes)

app.listen(5000, () => {
    console.log('Connected')
})