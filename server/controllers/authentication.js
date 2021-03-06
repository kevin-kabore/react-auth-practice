const jwt = require('jwt-simple');
const User = require('../models/User');
const config = require('../config')

function tokenForUser(user) {
  const timeStamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
}

exports.signin = function(req, res, next) {
  //User has already had thier email and password auth'd
  // Just need to give them a token
  res.json({ token: tokenForUser(req.user) })

}
exports.signup = function(req, res, next) {

  // See if a user with the given email exists
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' })
  }

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // If a user with email does exist, return error
    if(existingUser) {
      res.status(422).send({ error: 'Email is in use'})
    }

    // If a user does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err) }
      // Respond to req indicating the user was created
      res.json({token: tokenForUser(user)})
    })
  });



}
