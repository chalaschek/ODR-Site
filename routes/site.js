/**
 * Module dependencies.
 */

module.exports = function(app){
    app.get('/', function(req, res){
        if( req.session.user_id ){
            res.render('index', {games: null, campaigns: null});
        }else{
            res.render('splash');
        }
    });
    app.get('/jobs/FSEngineer.html', function(req, res){
      res.render('jobs/FSEngineer');
    });
    app.get('/jobs/UXDesign.html', function(req, res){
      res.render('jobs/UXDesign');
    });
    app.get('/jobs/careers.html', function(req, res){
      res.render('jobs/careers');
    });
};


