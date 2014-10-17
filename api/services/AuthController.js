/**
 * Created by Rajive on 24/9/14.
 */



var bcrypt = require('bcrypt');
var mailer = require("nodemailer");
var transporter = mailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'trashmap.mailer@gmail.com',
        pass: 'R00tr00t'
    }
});
var globalConfigs = {
    redis: 'localhost',
    webApp:"TrashMapW",
    clientApp:"TrashMapC"
};

var RedisSession = require('redis-sessions');
var redisSession = new RedisSession({

    host:globalConfigs.redis,
    port:6379,
    namespace:'tm'

});


module.exports = {

    createSessionForUser: function(userId,callback){

        var response = {
            code:200,
            token:null,
            error: null
        };

        if(userId == undefined){
            response.code = 403;
            response.token = null;
            response.error = "userId is not supplied"
            callback(response);

        }

        redisSession.create({
                app: globalConfigs.webApp,
                id: userId,
                ip: "127.1.0.1",
                ttl: 84600

            },

            function(err, resp) {

                if(err){
                    response.code = 403;
                    response.token = null;
                    response.error = err;

                    return callback(response);
                }
                response.code = 200;
                response.token = JSON.stringify(resp);
                response.error = null;

                return callback(response);
            });
    },

    killSessionForUser: function(req,callback)
    {

        console.log( req.cookies.MapOne);
        redisSession.kill({
            app:globalConfigs.webApp,
            token:req.cookies.MapOne.token
        },function(err,resp){

            if (err){
                return callback(false)
            }
            return callback(true);
        });
    },


    encryptPassword:  function(pass,callback){

        bcrypt.hash(pass,10,function(err,hash){

            if(err){
                return callback(err,null);

            }

            return callback(err,hash);
        });
    },



    comparePwd: function(reqPwd,usrPwd,callback){

        bcrypt.compare(reqPwd,usrPwd,function(err,match){

            console.log("Err while comparing? " + err);
            if(match){

                callback(true);
            }
            else{
                callback(false);
            }


        });
    }


};