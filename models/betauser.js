/**
 * Beta User model
 */ 

var crypto = require('crypto'), 
    sys = require('sys'),
    utils = require('../utils'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BetaUser = new Schema({
    comments: {type: String, validate: [utils.Models.validatePresenceOf, 'Please tell us a little more']},
    company: {type: String, validate: [utils.Models.validatePresenceOf, 'Please enter your company name']}, 
    email: {type: String, validate: [utils.Models.validateEmail, 'Please enter a valid email address']}, 
    name: {type: String, validate: [utils.Models.validatePresenceOf, 'Please enter your name']}, 
    ip_address: {type: String, default: ''}, 
    creation_date: {type: Date, default: Date.now},
    type: {type: Number, validate: [utils.Models.validatePresenceOf, 'Please tell select a type']},
});

//also check that this is a unique email address
BetaUser.path('email').validate(function (v, cb) {
    if( !v ){
        cb(false);
    }

    var t = mongoose.model('BetaUser');
    t.findOne({ email: v }, function(err, user) {
        if (user) {
            cb(false);
        }else{
            cb(true);
        }
    });
}, 'An account already exists with this email address');

//set error function
BetaUser.method('getErrors', utils.Models.errorFn);

mongoose.model('BetaUser', BetaUser);

module.exports.BetaUser = mongoose.model('BetaUser');