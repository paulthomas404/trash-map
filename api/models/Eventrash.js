/**
* Eventrash.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
      id:{
          type: 'integer',
          autoIncrement: true
      },

      trash_id:{
          type: 'integer'
      },
      event_id:{
          type: 'integer'
      },
      cleared:{
          type: 'boolean'
      }

  },
  beforeCreate: function(vals,cb){

      if(!vals.cleared){
          vals.cleared = false;
      }
      cb();
  }
};

