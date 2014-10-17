/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      full_name:{
          type: 'string'
      },
      email:{
          type: 'string'
      },
      password:{
          type: 'string'

      },
      deletedAt:{
          type:'datetime'
      },
      facebook_id:{
        type:'string'

      },
      toJSON: function(){
          var obj = this.toObject();
          delete obj.password;
          return obj;
      }

  },
    beforeCreate: function(attrs, next){
        if(attrs.password != undefined) {
            var bcrypt = require('bcrypt');

            bcrypt.genSalt(10, function (err, salt) {
                if (err) return next(err);

                bcrypt.hash(attrs.password, salt, function (err, hash) {
                    if (err) return next(err);

                    attrs.password = hash;
                    next();
                });
            });
        }
        else
            next();
	  }


   };

