var BetaUser = require('../models/betauser').BetaUser;


module.exports = function(app){
   
    /**
     * Add a beta advertiser.
     */
    app.get('/beta/register', function(req, res){
        res.render('beta/register', { user: new BetaUser()});
    });
   
    app.post('/beta/register', function(req, res, next){
        var data = req.body;

        //add ip_address
        if( !data['ip_address'] ){
            //data['ip_address'] = req.connection.remoteAddress;
            data['ip_address'] = req.headers['x-real-ip'];
        }

        //create user
        nUser = new BetaUser( data );

        //try to save
        nUser.save(function(err){
            //flash errors
            if (err) {
                var errs = nUser.getErrors(err);
                for(var i = 0; i < errs.length; i++){
                    req.flash('error', errs[i]);
                }
                res.render('beta/register', { user: nUser});	
            }else{

                //queue the notification email
                if (app.set('disableRegistrationEmails') != true){
                    app.emailHelper.queueBetaRegistrationEmail( nUser );
                }

                //TODO: redirect to success page
                res.render('beta/thanks');	    
            }
        });
    });   
}