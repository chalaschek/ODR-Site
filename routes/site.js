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
    
};