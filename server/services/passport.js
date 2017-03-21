const passport = require('passport');
const User = require('../models/User');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalSrategy = require('passport-local');

// Crate local Strategy
const localOptions = { usernameField: 'email'};
const localLogin = new LocalSrategy( {localOptions}, function(email, passport, done) {
  // Verify username and password, call done with the user
  // if it is with the correct email and password
  // Otherwise, call false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err);}
    if (!user) {return done(null, false)}

    // compare passwords - is 'password' equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    })
  })
})

//Set up options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
}
// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID and payload exist in database
  // If it does, call 'done' with that user
  // Otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    if (err) {
      done(err, false);
    };

    if (user) {
      done(null, user)
    } else {
      done(null, false)
    }
  });
});

// Tell passport to use this Strategy
passport.use(jwtLogin)
passport.use(localLogin)
