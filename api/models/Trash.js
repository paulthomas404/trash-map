/**
* Trash.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      reporter_id:{
          type: 'integer'
      },
      latitude: {
          type : 'float'
      },
      longitude:{
          type: 'float'
      },
      cleared:{
          type: 'boolean'
      },
      trash_pic:{
          type: 'string'
      },
      noise:{
          type: 'integer'
      },
      trash_type:{
          type: 'integer'
      },
      description:{
          type: 'text'
      },
      is_trash_can:{
          type: 'boolean'
      }

  },



    beforeCreate: function(trashObj,cb){

        //Set default values here for trashObject

        try {
            if (!trashObj.noise) {

                trashObj.noise = 1;
            }

            if (!trashObj.cleared) {
                trashObj.cleared = false;
            }

            if (!trashObj.trash_type) {
                trashObj.trash_type = 1; //Not Sure
            }

            if (!trashObj.reporter_id) {

                trashObj.reporter_id = 1; //This has to be id for Anonymous user.
            }

            if (!trashObj.description) {

                var desc = " Found unauthorized dump of garbage. Let us clean it! ";
                trashObj.description = desc;
            }

            if(!trashObj.is_trash_can){
                trashObj.is_trash_can = false;
            }
            cb();
        }
        catch(ex){
            cb(ex);
        }

    }
};

