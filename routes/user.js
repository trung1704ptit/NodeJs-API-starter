const express = require('express')
const router = require('express-promise-router')();

// const router = express.Router()
const userController =  require('../controllers/user')

router.route('/')
    .get(userController.getAllUser)
    .post(userController.createNewUser)

    // .delete()


router.route('/:userID')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .put(userController.replaceUser)
    
module.exports =  router;