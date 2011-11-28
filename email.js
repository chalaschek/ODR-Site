var client = require('beanstalk_client').Client;
    sys = require('sys');




module.exports = function(app){
    app.emailHelper = {};

    app.emailHelper.queueBetaRegistrationEmail = function( user ){

        var type = 'Brand';
        if(user.type == 2){
            type = 'Supplier';
        }else if(user.type == 3){
            type = "Developers";
        }
        //create body string
        var body = 'Good news - a new beta user just registered:\n\n' +
                    'Name: ' + user['name'] + '\n' + 
                    'Company: ' + user['company'] + '\n' + 
                    'Type: ' + type + '\n' +
                    'Comments: ' + user['comments']  + '\n' + 
                    'Email: ' + user['email'];

        client.connect( app.helpers.beanstalk_port , function(err, conn) {
            if (err) {
                sys.puts('Producer connection error:', sys, inspect(err));
            } else {

            }

            return conn.use('email', function() {
                var send_job;
                send_job = function() {
                    return conn.put(0, 0, 60, JSON.stringify({
                        type: 'email',
                        data: {
                            sender: 'ODR Support <support@opendataregistry.com>', 
                            to: 'chris.halaschek@opendataregistry.com,jeff.stein@opendataregistry.com', 
                            subject: 'Alert: New beta user registration',
                            body: body
                        }
                    }), function(err, job_id) {
                        sys.puts('Producer sent job: ' + job_id);
                        //return setTimeout(send_job, 1000);
                    });
                };
                return send_job();
            });
        });
    }
}