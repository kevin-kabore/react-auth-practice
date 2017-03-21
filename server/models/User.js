const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')

// Define user Model
const userSchema = new Schema({
  email: { type: String, unique: true , lowercase: true},
  password: String
});

// On Save Hook, encrypt password
// Before saving a model run this function
userSchema.pre('save', function(next) {
  // get access to the user model
  const user = this;

  // generate a salt, then run callback
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { next(err); }

    // hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;
      next();
    })
  });
});

userSchema.methods.comparePasswords = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if (err) { return callback(err); }
  })
}


// Create Model class
const ModelClass = mongoose.model('User', userSchema)

// Export Model
module.exports = ModelClass;
