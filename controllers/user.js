
const User = require('../models/User');

/*
- Callback
- Promises
- Async/Await
*/
const getUser = async (req, res, next) => {
    const { userID } = req.params
    const user = await User.findById(userID)
    return res.status(200).json({ user })
}

const getAllUser = async (req, res, next) => {
    const users = await User.find({})
    return res.status(200).json({users})
}

const createNewUser = async (req, res, next) => {
    const newUser = new User(req.body)
    await newUser.save()
    return res.status(201).json({user: newUser})
}

const updateUser = async (req, res, next) => {
    // Update user with some fields
}

const replaceUser = async (req, res, next) => {
    // Enforce new user to old user
    const { userID } = req.params
    const newUser = req.body
    const result = await User.findByIdAndUpdate(userID, newUser)
    return res.status(200).json({ user: newUser })
}

module.exports = {
    getAllUser,
    createNewUser,
    getUser,
    updateUser,
    replaceUser
}