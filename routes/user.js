const express = require('express')
const router = require('express-promise-router')();

// const router = express.Router()
const userController =  require('../controllers/user')

router.route('/')
    .get(userController.getAllUser)
    .post(userController.createNewUser)
    // .patch()
    // .put()
    // .delete()
    
module.exports =  router;