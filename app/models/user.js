// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

var userSchema = mongoose.Schema({

        username     : String,
        password     : String,
        admin        : Boolean,
        email        : String
});


//Methods==============================
userSchema.pre('save',
    function(next) {
        if (this.password) {
            this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
        }

        next();
    }
);

    userSchema.methods.generateJWT = function() {

      // set expiration to 60 days
      var today = new Date();
      var exp = new Date(today);
      exp.setDate(today.getDate() + 60);

      return jwt.sign({
        _id: this._id,
        username: this.username,
        exp: parseInt(exp.getTime() / 1000),
      }, 'SECRET');
    };

    userSchema.methods.isAdmin = function() {


      return this.admin;
    };
//generate a hash
    userSchema.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)};

    // Checking if password is valid]
    userSchema.methods.validPassword = function(password){
        return bcrypt.compareSync(password, this.password)
    };

    // Create the model for users and expose it to our app
    module.exports = mongoose.model('User', userSchema);
