var User = require('../models/user').User;


module.exports = function(app){
    app.get('/users/logout', function(req, res){
        if (req.session) {
            req.session.destroy(function() {});
        }
        res.redirect('/');
    });
    
    
    
    /**
     * Show login form
     */
    app.get('/users/login', function(req, res){
        //check if already logged in
        if( req.session.user_id ){
            res.redirect('/');
            return;
        }
        var redirect = req.query? req.query.redirect : null;

        res.render('users/login', { user: {}, redirect: redirect } );
    });
    
    
    
    /**
     * Login attempt for a user
     */
    app.post('/users/login', function(req, res){
        var data = req.body;

        //validate email
        var value = data.email;
        var vEmail = false;
        if( !(value && value.length) ){
            req.flash('error', 'Please enter a valid email address');
        }else{
            var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
            var valid = filter.test(value);
            if( !valid ){
                req.flash('error', 'Please enter a valid email address');
            }else{
                vEmail = true;
            }
        }

        var redirect = data.redirect;

        //validate password
        var value = data.password;
        if( !(value && value.length) ){
            req.flash('error', 'Please enter your password');
            res.render('users/login', { user: {email: data.email}, redirect: redirect });

        }else if( vEmail ){
            console.log("Looking for user with email: " + data.email);
            User.findOne({ email: data.email }, function(err, user) {
                console.log("Got user: " + user);
                if (user && user.authenticate(data.password)) {
                    // Regenerate session when signing in
                    // to prevent fixation
                    req.session.regenerate(function(){
                        req.session.user_id = user.id;
                        req.session.user = user;

                        if( redirect ){
                            res.redirect( redirect );
                        }else{
                            res.redirect('home');
                        }
                    });
                } else {
                    req.flash('error', 'Invalid email/password. Please try again.');
                    res.render('users/login', {user:{email: data.email}, redirect: redirect});
                }
            });
        }else{
            res.render('users/login', { user: {email: data.email}, redirect: redirect});
        }
    });



    /**
     * Show register form
     */
    app.get('/users/register', app.AuthHelper.isValidUser, app.AuthHelper.isAdminUser, function(req, res){	
         //check if already logged in
         if( req.session.user_id ){
             res.redirect('home');
             return;
         }
         
         //console.log(req);
         res.render('users/register', {user: new User()});
    });

    /**
     * Process register form
     */
    app.post('/users/register', app.AuthHelper.isValidUser, app.AuthHelper.isAdminUser, function(req, res){
        var data = req.body;

        if (data.password != data.confirm_password) {
            req.flash('error', 'Passwords do not match');
            res.render('users/register', { user: data });
        } else {
            //add ip_address
            if( !data['ip_address'] ){
                //data['ip_address'] = req.connection.remoteAddress;
                data['ip_address'] = req.headers['x-real-ip'];
            }

            if( data['confirm_password']  ){
                delete data['confirm_password'];
            }

            //create user
            nUser = new User( data );

            // check username
            nUser.save(function(err) {
                //flash errors
                if (err) {
                    var errs = nUser.getErrors(err);
                    for(var i = 0; i < errs.length; i++){
                        req.flash('error', errs[i]);
                    }
                    res.render('users/register', { user: nUser});	
                }else{
                    req.session.user_id = nUser.id;	    
                    //TODO: redirect to success page
                    res.redirect('home');
                }
            });
        }
    });
}