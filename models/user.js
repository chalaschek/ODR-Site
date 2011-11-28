/**
 * User model
 */
 
var crypto = require('crypto'), 
    sys = require('sys'),
    utils = require('../utils'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;
 
 
 
var User = new Schema({
    company: {type: String, validate: [utils.Models.validatePresenceOf, 'Please enter your company name']}, 
    email: {type: String, validate: [utils.Models.validateEmail, 'Please enter a valid email address']}, 
    name: {type: String, validate: [utils.Models.validatePresenceOf, 'Please enter your name']}, 
    ip_address: {type: String, default: ''},
    creation_date: {type: Date, default: Date.now},
    hashed_password: {type: String, validate: [utils.Models.validatePresenceOf, 'Please enter a password']},
    salt: String
});


//also check that this is a unique email address
User.path('email').validate(function (v, cb) {
    if( !v ){
        cb(false);
    }

    var t = mongoose.model('User');
    t.findOne({ email: v }, function(err, user) {
        if (user) {
            cb(false);
        }else{
            cb(true);
        }
    });
}, 'An account already exists with this email address');


/*  Virtuals */
User.virtual('id').get(function() {
    return this._id.toHexString();
});

User.virtual('password')
    .set(function(pw) {
        this._password = pw;
        this.salt = this.createSalt();
        this.hashed_password = this.encryptPassword(pw);
    })
    .get(function() { return this._password; });



/*  Instance Methods */
User.method('authenticate', function(plain) {
    return this.encryptPassword(plain) === this.hashed_password;
});

User.method('createSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
});

User.method('encryptPassword', function(str) {
    return crypto.createHmac('sha1', this.salt).update(str).digest('hex');
});


//set error function
User.method('getErrors', utils.Models.errorFn);

mongoose.model('User', User);

module.exports.User = mongoose.model('User');