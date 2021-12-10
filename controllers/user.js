
const User = require('../models/User');
const Deck = require('../models/Deck');
const JWT = require('jsonwebtoken');

const { JWT_SECRET } = require('../configs')

const encodeToken = userID => {
  return JWT.sign({
    iss: 'Trung Nguyen',
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3)
  }, JWT_SECRET)
}

const authFacebook = async (req, res, next) => {
  const { user } = req
  const token = encodeToken(user._id)
  res.setHeader('Authorization', token)
  return res.status(200).json({ success: true })
}

const authGoogle = async (req, res, next) => {
  const { user } = req
  const token = encodeToken(user._id)
  res.setHeader('Authorization', token)
  return res.status(200).json({ success: true })
}

const getUser = async (req, res, next) => {
    const { userID } = req.value.params
    const user = await User.findById(userID)
    return res.status(200).json({ user })
}

const getUserDecks = async (req, res, next) => {
    const { userID } = req.value.params
    const user = await User.findById(userID).populate('decks')
    return res.status(200).json({ decks: user.decks })
}

const newUserDeck = async (req, res, next) => {
    const { userID } = req.value.params
    // Create a new deck
    const newDeck = new Deck(req.value.body)

    // Get user
    const user = await User.findById(userID)
    
    // Assign user as owner of deck
    newDeck.owner = user

    // Save the deck
    await newDeck.save()

    // Add deck to user's decks list
    user.decks.push(newDeck._id)

    // Save user with new decks
    await user.save()

    return res.status(201).json({ deck: newDeck })
}

const getAllUser = async (req, res, next) => {
    const users = await User.find({})
    return res.status(200).json({users})
}

const newUser = async (req, res, next) => {
    const newUser = new User(req.value.body)
    await newUser.save()
    return res.status(201).json({user: newUser})
}

const updateUser = async (req, res, next) => {
    // Update user with some fields
    const { userID } = req.value.params
    const newUser = req.value.body
    const result = await User.findByIdAndUpdate(userID, newUser)
    return res.status(200).json({ success: true })
}

const replaceUser = async (req, res, next) => {
    // Enforce new user to old user
    const { userID } = req.value.params
    const newUser = req.value.body
    const result = await User.findByIdAndUpdate(userID, newUser)
    return res.status(200).json({ success: true })
}

const signUp =  async (req, res, next) => {
    const { firstName, lastName, email, password } = req.value.body;
    // check if user with email already exist
    const userFound = await User.findOne({ email })
    if (userFound) {
      return res.status(403).json({ error: { message: 'Email already registered' }})
    }
    // Create a new User
    const user = new User({ firstName, lastName, email, password })
    await user.save()

    const token = encodeToken(user._id)
    res.setHeader('Authorization', token)
    return res.status(201).json({ success: true })
}

const signIn =  async (req, res, next) => {
  const token = encodeToken(req.user._id)
  const user = req.user
  res.setHeader('Authorization', token)
  const userProfile = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    authFacebookID: user.authFacebookID,
    authGoogleID: user.authGoogleID,
    authType: user.authType,
  } 
  return res.status(200).json({ user: userProfile })
}

const secret =  async (req, res, next) => {
    // console.log('call secret method')
    return res.status(200).json({ resource: true })
}

module.exports = {
    getUser,
    getAllUser,
    getUserDecks,
    newUser,
    newUserDeck,
    updateUser,
    replaceUser,
    secret,
    signIn,
    signUp,
    authGoogle,
    authFacebook
}
