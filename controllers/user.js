
const User = require('../models/User');

/*
- Callback
- Promises
- Async/Await
*/

const getAllUser = async (req, res, next) => {
    const users = await User.find({})
    return res.status(200).json({users})
}

const createNewUser = async (req, res, next) => {
    const newUser = new User(req.body)
    await newUser.save()
    return res.status(201).json({user: newUser})
}

module.exports = {
    getAllUser,
    createNewUser
}