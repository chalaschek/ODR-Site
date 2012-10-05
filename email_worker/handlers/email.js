var nodemailer = require("nodemailer");

nodemailer.SMTP = {
    host: "s96433.gridserver.com",
    port: 465,
    ssl: true,
    use_authentication: true,
    user: "support@opendataregistry.com",
    pass: "opendata",
	debug: true
};


exports.handlers = {
    email: function(data, done) {	
        //send the email
        nodemailer.send_mail({
            sender: data['sender'], 
            to: data['to'],
            subject: data['subject'],
            body: data['body']
        },
        function(error, success){
            console.log("Message "+(success?"sent":"failed"));
            console.log(error);
            //fire done message
            done();
        });
    }
};
