const uuidGen = require('uuid')
const os = require('os')
const { insertIntoUsers } = require('../module/dbOperations')

const cookieOptions = {
    //domain: 'http://localhost:5000/auth',
    httpOnly: false,
    sameSite: 'none',
    secure: true,
    //expires: new Date('2023-04-21').getMilliseconds()
}

const createUsers = (req, res) => {
    const cookie = req.cookies.user
    const hostName = os.hostname()

    if(!cookie){
        const uuid = uuidGen.v4()

        res.cookie('user', uuid, cookieOptions)

        insertIntoUsers(hostName, uuid)

        res.status(200).json({hostname: hostName, uuid: uuid})
    }else{
        res.status(200).json({hostname: hostName, uuid: cookie})
    }
}

module.exports = {
    createUsers
}