const User = require('../models/user')

exports.signup = function(req, res, next) {

  // See if a user with the given email exists
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err) }

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
      // Respond to req indicating the user was created2
      res.json({sucess: true})
    })
  });



}
