module.exports = function(app){
    app.ErrorHelper = {};

    // app error codes
    app.ErrorHelper.Codes = {};
    app.ErrorHelper.Codes.Success = {http_status: 200, odr_code: 0, message: 'Success'};
    app.ErrorHelper.Codes.InvalidEndpoint = {http_status: 400, odr_code: 1, message: 'Endpoint is not valid'};
    app.ErrorHelper.Codes.InvalidSignature = {http_status: 401, odr_code: 2, message: 'Invalid request signature'};
    app.ErrorHelper.Codes.Unauthorized = {http_status: 401, odr_code: 3, message: 'You do not have permission to access this resource'};
    app.ErrorHelper.Codes.ContestActive = {http_status: 400, odr_code: 4, message: 'Contest is still active'};
    app.ErrorHelper.Codes.IneligiblePlayer = {http_status: 400, odr_code: 5, message: 'Ineligible player'};
    app.ErrorHelper.Codes.ContestOver = {http_status: 400, odr_code: 6, message: 'Contest is no longer valid'};
    app.ErrorHelper.Codes.InvalidResponseType = {http_status: 400, odr_code: 7, message: 'Invalid response format'};
    app.ErrorHelper.Codes.PageNotFound = {http_status: 404, odr_code: 8, message: 'Page not found'};
    app.ErrorHelper.Codes.JSONPCallbackRequired = {http_status: 400, odr_code: 9, message: 'JSONP callback required'};
    app.ErrorHelper.Codes.SignatureTimestampExpired = {http_status: 401, odr_code: 10, message: 'Signature timestamp greater than 15 minutes'};

    //unauthorized error
    function ODRError(path, error_obj){
        this.name = 'ODR Error';
        Error.call(this, error_obj.message);	
        this.odr_code = error_obj.odr_code;	
        this.http_status = error_obj.http_status;	
        this.message = error_obj.message;			
        this.path = path;
        Error.captureStackTrace(this, arguments.callee);
    };

    ODRError.prototype.__proto__ = Error.prototype;
    app.ErrorHelper.ODRError = ODRError;	
}