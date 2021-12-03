const express = require('express')
const router = require('express-promise-router')();

// const router = express.Router()
const userController =  require('../controllers/user')

router.route('/')
    .get(userController.getAllUser)
    .post(userController.newUser)


router.route('/:userID')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .put(userController.replaceUser)


router.route('/:userID/decks')
    .get(userController.getUserDecks)
    .post(userController.newUserDeck)
    
module.exports =  router;