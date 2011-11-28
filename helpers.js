

module.exports = function(app){
    //first setup helpers
    var helpers = {
        nameAndVersion: function(name, version) {
            return name + ' v' + version;
        },
        apiBase: 'http://www.opendataregistry.com/api/{version}/',
        apiBaseCurrVersion: 'http://www.opendataregistry.com/api/1.0/',
        appName: 'ODR',
        currentAPIVersion: "1.0",
        version: '0.1',
        beanstalk_port: '127.0.0.1:11300',
        isAdminUser: function(req){
            return app.AuthHelper.checkAdminUser(req.session.user);
        },
        base: '/' == app.route ? '' : app.route,
        isLoggedIn: function(req, res){
            return (req.session.user_id);
        },
        getUser: function(req, res){
            return (req.session.user);
        }
    };	
    
    app.helpers( helpers );


    //next configure dynamic helpers
    // flash message class
    function FlashMessage(type, msgs) {
        this.type = type;
        this.messages = typeof msgs === String ? [msgs] : msgs;
    }

    FlashMessage.prototype = {
        getStateClass: function() {
            switch (this.type) {
                case 'info':
                    return 'info';
                case 'error':
                    return 'error';
            }
        },    
        toHtml: function() {
            var body = '';
            for(var i = 0; i < this.messages.length; i++){
                body += '<div>' + this.messages[i] + '</div>';
            }

            return '<div class="messages">' + '<div class="' + this.getStateClass() + '">' + body + '</div></div>';
        }
    };

    var dynamicHelpers = {
        flashMessages: function(req, res) {
            var html = '';
            [ 'info', 'error' ].forEach(function(type) {
                var messages = req.flash(type);
                if (messages.length > 0) {
                    html += new FlashMessage(type, messages).toHtml();
                }
            });
            return html;
        },
        isLoggedIn: function(req, res){
            return (req.session.user_id);
        },
        getUser: function(req, res){
            return (req.session.user);
        },
        isAdminUser: function(req){
            return app.AuthHelper.checkAdminUser(req.session.user);
        },
        messages: require('express-messages')
    };

    app.dynamicHelpers( dynamicHelpers );
}


