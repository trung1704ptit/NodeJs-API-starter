const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { JWT_SECRET } = require('../configs')
const { ExtractJwt } = require('passport-jwt')
const User = require('../models/User');

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)
    // check if user does not exists
    if (!user) {
      return done(null, false)
    }
    done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))


// passport local
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return done(null, false)
    }
  
    // Compare password
    const isCorrectPassword = await user.isValidPassword(password)
    if (!isCorrectPassword)  return done(null, false)
    
    // pass the user to the req => req.user
    return done(null, user)
  } catch (error) {
    return done(null, false)
  }
}))
