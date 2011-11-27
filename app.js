
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
    app.register('.html', require('ejs'));    	
    app.set('views', __dirname + '/views');
    app.set('view engine', 'html');
    app.set('view options', { layout: 'layouts/default' });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use( express.session( { secret: "keyboard cat" } ) );
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.set('m_database', 'devilsmen');	
    app.set('m_host', 'localhost');  
    app.set('connstring', 'mongodb://' + app.set('m_host') + '/' + app.set('m_database'));
});

app.configure('production', function(){
    app.set('m_database', 'devilsmen');	
    app.set('m_host', 'localhost');  
    app.set('connstring', 'mongodb://' + app.set('m_host') + '/' + app.set('m_database'));
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.listen(3002);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
