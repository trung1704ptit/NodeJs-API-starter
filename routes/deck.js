const router = require('express-promise-router')();
const { validateBody, validateParam, schemas } = require('../helpers/routerHelpers');

const deckController =  require('../controllers/deck')

router.route('/')
    .get(deckController.getAllDecks)
    .post(validateBody(schemas.deckSchema), deckController.newDeck)

router.route('/:deckID')
    .get(validateParam(schemas.idSchema, 'deckID'), deckController.getDeck)
    .put(validateParam(schemas.idSchema, 'deckID'), validateBody(schemas.newDeckSchema), deckController.replaceDeck)
    .patch(validateParam(schemas.idSchema, 'deckID'), validateBody(schemas.deckOptionalSchema), deckController.updateDeck)
    .delete(validateParam(schemas.idSchema, 'deckID'), deckController.deleteDeck)

module.exports =  router;