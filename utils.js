var crypto = require('crypto'),
    sys = require('sys');

exports.String = {
    trim: function(string){
        return string.replace(/^\s*|\s*$/, '');
    }
};


exports.API = {
    getAPIView: function( req ){
        //handle case where jsonp but no callback provided - just return json
        if( req.apiFormat == "jsonp" && req.jsonpCB == null){
            return 'api/json_response';
        }

        //handle case where format was invalid and apiFormat is not set
        if( req.apiFormat == null){
            return 'api/json_response';
        }

        return 'api/'+ req.apiFormat + '_response';
    }
}


exports.Auth = {
    computeSha1Digest: function( secret, data ){
        //create digest
        var hmac = crypto.createHmac("sha1", secret);
        var hash2 = hmac.update(data);
        return hmac.digest(encoding="base64");
    },

    computeSignature: function( httpVerb, paramsMap, date, secret ){
        //get params
        var keys = [];
        var valMap = {};
        //helper method to collect params
        function collectParams( col ){
            for(var key in col){
                //get value
                var val = col[key];
                //get type
                var type = typeof val;
                //if number or string then consider
                if( type == "number" || type == "string"  ){
                    keys.push( key.toLowerCase() );
                    valMap[key.toLowerCase()] = col[key];
                }
            }
        }

        collectParams(paramsMap);

        //sort the keys
        keys.sort();

        //build the string
        var params = "";

        for( var i = 0; i < keys.length; i++ ){
            var key = keys[i];
            params += exports.String.trim(key) + ":" + exports.String.trim(valMap[key]) + "\n";
        }

        //join with date
        var data = httpVerb + "\n" + date + "\n" + params;

        //create digest
        var hmac = crypto.createHmac("sha1", secret);
        var hash2 = hmac.update(data);
        var digest = this.computeSha1Digest(secret, data);
        
        return digest;
    }
}


exports.Models = {
    extractError: function(err){
        return err.type;
    },

    validatePresenceOf: function(value) {
        return value && value.length;
    }
};

exports.Models.errorFn = function(err) {
    var errors = [];
    for(var er in err['errors']){
        errors.push( exports.Models.extractError( err['errors'][er] ) );
    }
    return errors;
};


exports.Models.validateEmail = function(value){
    if( !exports.Models.validatePresenceOf( value ) ){
        return false;
    }

    var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    return filter.test(value);
}


exports.HTTP = {
    canonicalizeParams: function( req ){
        //get params
        var keys = [];
        var valMap = {};

        //helper method to collect params
        function collectParams( col ){
            for(var key in col){
                //get value
                var val = col[key];
                //get type
                var type = typeof val;
                //if number or string then consider
                if( type == "number" || type == "string"  ){
                    keys.push( key.toLowerCase() );
                    valMap[key.toLowerCase()] = col[key];
                }
            }
        }

        //first get query params if they exist
        if( req.query ){
            collectParams(req.query);
        }
        //first get query params if they exist
        if( req.body ){
            collectParams(req.body);
        }

        //sort the keys
        keys.sort();

        //build the string
        var params = "";

        for( var i = 0; i < keys.length; i++ ){
            var key = keys[i];
            params += exports.String.trim(key) + ":" + exports.String.trim(valMap[key]) + "\n";
        }

        return params;
    },


    /**
    * Helper method to parse the signature components from an API reqest
    */
    parseAuthHeader: function( req ){
        //get the Auth header
        var auth = req.header("Authorization");
        if( !auth ){
            return null;
        }

        //find the ODR offset
        var fIdx = auth.indexOf( "ODR ");
        if( fIdx == -1 ){
            return null;
        }

        //strip the ODR offset
        var authBody = auth.substring( fIdx+4, auth.length );

        //split based on colon
        var authComponents = authBody.split(":");
        if( authComponents.length != 2 ){
            return null;
        }

        //return
        return authComponents;
    },

    /**
    * Helper method to get the jsonp callback
    */	
    getJSONPCallback: function( req ){
        //first check for callback in query params if they exist
        if( req.query && req.query.callback){
            return req.query.callback;
        }

        //first check for callback in body params if they exist
        if( req.body && req.body.callback){
            return req.body.callback;
        }

        return null;
    }
}

