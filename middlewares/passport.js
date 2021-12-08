const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const { JWT_SECRET, auth } = require('../configs')
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

// Passport google
passport.use(new GooglePlusTokenStrategy({
  clientID: auth.google.CLIENT_ID,
  clientSecret: auth.google.CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // check if user already exist
    const user = await User.findOne({ authGoogleID: profile.id, authType: 'google' })
    console.log(user)
    if (user) {
      return done(null, user)
    } else {
      // Create new user
      const newUser = new User({
        authType: 'google',
        email: profile.emails[0].value,
        authGoogleID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName
      })

      await newUser.save()

      done(null, newUser)
    }
  } catch (error) {
    console.log(error)
    done(null, error)
  }
}))

// Passport facebook
passport.use(new FacebookTokenStrategy({
  clientID: auth.facebook.CLIENT_ID,
  clientSecret: auth.facebook.CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // check if user already exist
    const user = await User.findOne({ authFacebookID: profile.id, authType: 'facebook' })
    console.log(user)
    if (user) {
      return done(null, user)
    } else {
      // Create new user
      const newUser = new User({
        authType: 'facebook',
        email: profile.emails[0].value,
        authFacebookID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName
      })

      await newUser.save()

      done(null, newUser)
    }
  } catch (error) {
    console.log(error)
    done(null, error)
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
