const uuidGen = require('uuid')
const os = require('os')
const DataBaseOperations = require('../module/dbOperations')
const { log } = require('console')

const cookieOptions = {
    //domain: 'http://127.0.0.1:5173/',
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    //expires: new Date('2023-04-21').getMilliseconds()
}

const createUsers = (req, res) => {
    const cookie = req.cookies.user
    const hostName = os.hostname()

    log(cookie)

    if(!cookie){
        const uuid = uuidGen.v4()
        let database = new DataBaseOperations(uuid)

        res.cookie('user', uuid, cookieOptions)
        database.insertIntoUsers(hostName, uuid)

        res.status(200).json({cookieCreated: true, hostname: hostName, uuid: uuid})
    }else{
        res.status(200).json({cookieCreated: false, hostname: hostName, uuid: cookie})
    }
}

module.exports = {
    createUsers
}