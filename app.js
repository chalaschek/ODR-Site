
/**
 * Module dependencies.
 */

var express = require('express'),
    mongoose = require('mongoose'),
    utils = require('./utils'),
    http = require('http'),
    messages = require('express-messages');


// create server
var app = module.exports = express.createServer();

// setup helpers
require('./helpers.js')(app);

// setup error types
require('./error.js')(app);


// Configuration

app.configure(function(){
    app.register('.html', require('ejs'));    	
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('view options', { layout: 'layouts/default' });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    
    //TODO: change to mongo or redis
    app.use(express.cookieParser());
    app.use( express.session( { secret: "keyboard cat" } ) );
    
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.set('use_auth', true);
    //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('m_database', 'odrsite');	
    app.set('m_host', 'localhost');  
    app.set('connstring', 'mongodb://' + app.set('m_host') + '/' + app.set('m_database'));
});

app.configure('production', function(){
    app.set('use_auth', true);
    app.set('m_database', 'odrsite');	
    app.set('m_host', 'localhost');  
    app.set('connstring', 'mongodb://' + app.set('m_host') + '/' + app.set('m_database'));
});


// Configure mongoose models
BetaUser = require('./models/betauser');
User = require('./models/user');
App = require('./models/app');

//connect the db
db = mongoose.connect(app.set('connstring'));


// Setup auth
require('./auth')(app);

require('./routes/errors')(app);


// Routes
require('./routes/site')(app);
require('./routes/users')(app);
require('./routes/beta')(app);


//setup email notifications
require('./email')(app);

// Only listen on $ node app.js
if (!module.parent) {
    app.listen(3002);
    console.log("ODR Site server listening on port %d in %s mode", app.address().port, app.settings.env);
}
