/**
* Events.js
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
      org_id:{
          type: 'integer',
          required: true
      },

      contact_phone:{
          type:'string'
      },
      contact_email:{
          type:'string'
      },
      event_start_date:{
          type: 'date'
      },
      event_end_date:{
          type: 'date'
      },
      meet_at:{
          type: 'text'
      },
      remarks:{
          type: 'text'
      },
      status:{
          type: 'string'
      }
  },

    beforeCreate:function(event,cb){

        if(!event.status)
        {
            event.status = 'New'
        }
        cb();
    }

};

