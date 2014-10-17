/**
* History.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

      actor: {
          type: 'integer'
      },
      description:{
          type: 'text'
      },
      module:{
          type: 'string'
      },
      event_id:{
          type :'string'
      }

  }
};

