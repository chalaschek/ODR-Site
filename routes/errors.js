var utils = require('../utils');

/**
 * Module dependencies.
 */


module.exports = function(app){
    // When no more middleware require execution, aka
    // our router is finished and did not respond, we
    // can assume that it is "not found". Instead of
    // letting Connect deal with this, we define our
    // custom middleware here to simply pass a NotFound
    // exception

	app.use(function(req, res, next){
        next(new app.ErrorHelper.ODRError(req.url, app.ErrorHelper.Codes.PageNotFound));
    });


    // We can call app.error() several times as shown below.
    // Here we check for an instanceof NotFound and show the
    // 404 page, or we pass on to the next error handler.

    // These handlers could potentially be defined within
    // configure() blocks to provide introspection when
    // in the development environment.

    app.error(function(err, req, res, next){
        if (err instanceof app.ErrorHelper.ODRError) {
            //if this is an api request, then always return json on error
            if(req.isAPI == true){
                res.render( utils.API.getAPIView(req), {layout: false, status: err.http_status, odr_code: err.odr_code, response: err.response, callback: req.jsonpCB });
            }else{
                //render appropriate error page
                if( err.http_status == 404 ){
                    res.render('errors/404', { status: err.http_status, error: err});
                }
                else if( err.http_status == 401 ){
                    res.render('errors/401', { status: err.http_status, error: err});
                }
                else if( err.http_status == 400 ){
                    res.render('errors/400', { status: err.http_status, error: err});
                }else{
                    res.render('errors/500', { status: 500, error: err});
                }
            }
        }else{
            next(err);
        }
    });

    // Here we assume all errors as 500 for simplicity 
    app.error(function(err, req, res, next){
        res.render('errors/500', { status: 500, error: err});
    });
};