var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Aoo = mongoose.model('App'),    
    crypto = require('crypto'),
    utils = require('./utils');


module.exports = function(app){ 
    app.AuthHelper = {};

    //admin list
    //TODO: this should be pushed into the DB
    app.AuthHelper.adminList = {'chris.halaschek@opendataregistry.com':1, 'jeff.stein@opendataregistry.com':1};

    app.AuthHelper.checkAdminUser = function(user) {
        if( !app.set("use_auth") ){
            return true;
        }

        if( user && app.AuthHelper.adminList[user['email']] == 1 )
            return true;
        else
            return false;
   };


  /**
   * Loads the used for a request
   * 
   * @param express request
   * @param express response
   * @param express next function
   */
    app.AuthHelper.isValidUser = function(req, res, next) {
        if (!app.set("use_auth") || req.session.user_id) {	
            return next();
        } else {
            res.redirect('/users/login?redirect=' + encodeURIComponent(req.url));
        }
    };



  /**
   * Loads the used for a request
   * 
   * @param express request
   * @param express response
   * @param express next function
   */
    app.AuthHelper.isAdminUser = function(req, res, next) {
        if( !app.set("use_auth") ){
            return next();
        }

        if ( req.session.user && app.AuthHelper.checkAdminUser(req.session.user) ) {
            return next();
        }else{
            return next( new app.ErrorHelper.ODRError( req.url, app.ErrorHelper.Codes.Unauthorized) );
        }
   };



   app.AuthHelper.validateSignature = function(req, res, next) {
       //check if we should even use auth
       if( !app.set("use_auth") ){
           return next();
       }

       //get game id and signature from auth header
       var authComponents = utils.HTTP.parseAuthHeader( req );

       //console.log(authComponents);
       
       if( authComponents == null ){
           return next( new app.ErrorHelper.ODRError( req.url, app.ErrorHelper.Codes.InvalidSignature) );
       }
       var appId = authComponents[0];
       var sig = authComponents[1];

       req.appId = appId;

       //get the secret for this game_id
       App.findById( appId, function (err, app) {
           if( err || !app ){
               return next( new app.ErrorHelper.ODRError( req.url, app.ErrorHelper.Codes.InvalidSignature) );
           }

           var secret = app.secret;
           
           //create the string to be signed
           //get date
           var date = req.header("x-odr-date");
           if( !date ){
               date = req.header("Date");
           }

           //check if the date is within 15 minutes of server time
           var currTime = new Date().getTime();
           var sigDate = date == null? 0 : new Date( date ).getTime();

           //console.log("Sig date: " + new Date(date));
           //console.log("Curr date: " + new Date());
           var diff = Math.abs( currTime - sigDate );

           //console.log("Date diff: " + diff);

           if( isNaN(diff) || diff > (15*60000)  ){
               return next( new app.ErrorHelper.ODRError( req.url, app.ErrorHelper.Codes.SignatureTimestampExpired) );
           }

           //get canoncalized params
           var params = utils.HTTP.canonicalizeParams(req);

           //build signature string
           var data = 	req.method + "\n" + date + "\n" + params;

           //create digest
           var hmac = crypto.createHmac("sha1", secret);
           var hash2 = hmac.update(data);
           var digest = utils.Auth.computeSha1Digest(secret, data);

           console.log(params);
           console.log(date);
           console.log(feed);
           console.log(sig);
           console.log(data);
           console.log(digest);

           //compare with passes signature
           if( digest == sig ){
               return next();
           }else{
               return next( new app.ErrorHelper.FanaticoError( req.url, app.ErrorHelper.Codes.InvalidSignature) );
           }
       });
   };

};