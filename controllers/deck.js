
const User = require('../models/User');
const Deck = require('../models/Deck');

const getDeck = async (req, res, next) => {
    const { deckID } = req.value.params
    const deck = await Deck.findById(deckID)
    return res.status(200).json({ deck })
}

const getAllDecks = async (req, res, next) => {
    const decks = await Deck.find({})
    return res.status(200).json({ decks: decks })
}

const newDeck = async (req, res, next) => {
    // find owner
    const owner = await User.findById(req.value.body.owner)
    if (owner) {
        // create a new deck
        const deckBody = req.value.body
        const newDeck = new Deck(deckBody)
        await newDeck.save()

        owner.decks.push(newDeck._id)
        await owner.save()

        return res.status(200).json({ deck: newDeck })
    }
    return res.status(400).json({ message: 'Owner not found'})
}

const replaceDeck = async (req, res, next) => {
    const { deckID } = req.value.params;
    const body = req.value.body
    const deck = await Deck.findByIdAndUpdate(deckID, body)
    // if put owner => remove the user's deck of current deck
    if (deck) {
        const owner = await User.findById(deck.owner)
        if (owner) {
            owner.decks.pull(deckID)
            await owner.save()
        
            const newOwner = await User.findById(body.owner)
            newOwner.decks.push(deckID)
            await newOwner.save()
            return res.status(200).json({ success: true })
        }
        return res.status(400).json({message: 'Owner of deck not found'})
    }
    return res.status(400).json({message: 'Deck not found'})

}

const updateDeck = async (req, res, next) => {
    const { deckID } = req.value.params;
    const body = req.value.body
    const deck = await Deck.findByIdAndUpdate(deckID, req.value.body)
    if (body.owner) {
        // if put owner => remove the user's deck of current deck
        const owner = await User.findById(deck.owner)

        if (owner) {
            owner.decks.pull(deckID)
            await owner.save()
        
            const newOwner = await User.findById(body.owner)
            newOwner.decks.push(deckID)
            await newOwner.save()
        } else {
            return res.status(400).json({message: 'Owner of deck not found'})
        }
    }
    return res.status(200).json({ success: true })
}

const deleteDeck = async (req, res, next) => {
    const { deckID } = req.value.params
    const deck = await Deck.findById(deckID)
    const userID = deck.owner

    // get the owner
    const owner = await User.findById(userID)


    // remove deck from owner
    await owner.decks.pull(deck)
    await owner.save()

    // remove deck
    await deck.remove()

    res.status(200).json({ success: true })
}

module.exports = {
    deleteDeck,
    replaceDeck,
    updateDeck,
    getDeck,
    newDeck,
    getAllDecks
}