const mongoose = require('mongoose');
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
    },
    decks: [{
        type: Schema.Types.ObjectId,
        ref: 'Deck'
    }]
})

UserSchema.pre('save', async function(next) {
  try {
    // generate a salt
    const salt = await bcrypt.genSalt(10)

    // generate password = salt + hash
    const passwordHashed = await bcrypt.hash(this.password, salt)
    
    // re-assign password to user
    this.password = passwordHashed
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function(inputPassword) {
  try {
    // all the method of bcrypt will return promise
    // we need to await
    return await bcrypt.compare(inputPassword, this.password)
  } catch (error) {
    throw new Error(error)
  }
}

const User = mongoose.model('User', UserSchema)

module.exports = User
