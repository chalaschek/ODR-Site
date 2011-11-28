/**
 * App model
 */
 
var crypto = require('crypto'), 
    sys = require('sys'),
    utils = require('../utils'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
    
var App = new Schema({
    secret: String, 
    creator_id: Schema.ObjectId,
    name: {type: String, validate: [utils.Models.validatePresenceOf, 'Please enter a name']},
    type: {type: String, validate: [utils.Models.validatePresenceOf, 'Please select a type']}, 
    category: {type: String, validate: [utils.Models.validatePresenceOf, 'Please select a category']},
    tags: [String],
    creation_date: {type: Date, default: Date.now}
});	


App.virtual('id').get(function() {
    return this._id.toHexString();
});

App.pre( 'save', function(next){
    //get timestamp to hash using id
    var t_s = Math.round((new Date().valueOf() * Math.random())) + '';

    //create the secret
    this.secret = utils.Auth.computeSha1Digest(this.id, t_s);

    next();
});

//set error function
App.method('getErrors', utils.Models.errorFn);

mongoose.model('App', App);

module.exports.App = mongoose.model('App');