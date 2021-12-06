const express = require('express')
const router = require('express-promise-router')();
const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers');

// const router = express.Router()
const userController = require('../controllers/user')

router.route('/')
  .get(userController.getAllUser)
  .post(validateBody(schemas.userSchema), userController.newUser)

router.route('/signin')
  .post(validateBody(schemas.authSignInSchema), userController.signIn)

router.route('/signup')
  .post(validateBody(schemas.authSignUpSchema), userController.signUp)

router.route('/secret')
  .get(validateBody(schemas.authSignInSchema), userController.secret)

router.route('/:userID')
  .get(validateParam(schemas.idSchema, 'userID'), userController.getUser)
  .patch(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userOptionalSchema), userController.updateUser)
  .put(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.userSchema), userController.replaceUser)


router.route('/:userID/decks')
  .get(validateParam(schemas.idSchema, 'userID'), userController.getUserDecks)
  .post(validateParam(schemas.idSchema, 'userID'), validateBody(schemas.deckSchema), userController.newUserDeck)

module.exports = router;
