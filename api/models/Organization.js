/**
* Organization.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {


    attributes: {

        name:{
            type: 'string',
            required: true
        },
        type:{
            type: 'string'

        },
        location:{
            type: 'json'
        },
        poc_id:{
            type: 'integer'
        }

    },

    beforeCreate: function(orgObj,cb){

        User.findOne({email:orgObj.email}).exec(function(err,found){

            if(err){
                cb(err);
            }

            if(!found){

                 var userObj = {email:orgObj.email,
                 password: orgObj.password,
                 full_name: orgObj.poc
                 };

                User.create(userObj).exec(function(err,user){
                    if(err)
                    {
                        cb(err);
                    }

                    if(user){

                        orgObj.poc_id = user.id;
                        cb();
                    }
                    else
                    {
                        cb('Error creating User');
                    }

                });
            }
            else
            {
                orgObj.poc_id = found.id;
                cb();
            }
        });
    },

    afterCreate:function(org,cb){

        var orgUsrObj = {};
        orgUsrObj.org_id = org.id;
        orgUsrObj.member_id = org.poc_id;

        Orguser.create(orgUsrObj).exec(function(err,orgusr){

            if(err){
                cb(err);
            }
            if(orgusr){
                cb();
            }
            else
            {
                cb('Error Creating User for Org');
            }

        });
    }
};

