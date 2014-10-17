/**
 * Created by root on 24/9/14.
 */

var events = require('events');
var mailer = require("nodemailer");
var transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: sails.config.accounts.gmail.username,
        pass: sails.config.accounts.gmail.password
    }
});


var crypto = require('crypto');

module.exports = {

    sendEmail: function(emailRecord,callback){

        if(emailRecord.email == 'undefined'){
            return callback({code:500,error:"Email To is empty"});
        };



        var mailOptions = {
            from: 'admin@trashmap.in',
            to: emailRecord.email,
            subject: 'Your Trashmap Password',
            html: emailRecord.bodyText
        };

        transporter.sendMail(mailOptions);
        callback({code:200, error:"Email has been sent to: " + emailRecord.email});
    },

    generateRandomPassword: function(len){
        return crypto.randomBytes(Math.ceil(len/2))
            .toString('hex') // convert to hexadecimal format
            .slice(0,len);   // return required number of characters

    }

}