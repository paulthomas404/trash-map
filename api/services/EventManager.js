/**
 * Created by root on 27/9/14.
 */

var util = require('util');
var events = require('events');
var EventEmitter = new events.EventEmitter();
var eventObjects = sails.config.globals.eventObjects;


function reportEvent(event,eventObject){

 function getEventMap(event){


     for(var index in eventObjects){

        if(eventObjects[index].event_id == event){

            return eventObjects[index];
        }


     }
     return null;
 }

function handleEvent(eventObject)    {


    function addActivityLog(){

        var event = eventObject.event;

        var activityLog = getEventMap(event);
        if(!activityLog){
            sails.log.error('Invalid Event: ' + event );
            return;
        }
        activityLog.actor = eventObject.actor;
        History.create(activityLog,function(err,history){

            if(err){
                sails.log.error('Error in updating history: \n' + err);
                return;
            }
            if(history){

                sails.log.info("A New Event Created" + history.event_id);
                return;
            }
        });

    }

    addActivityLog();
    sails.log.info('You can add any further handlers here for the event');

};


 EventEmitter.on(event,handleEvent);
 EventEmitter.emit(event,eventObject);

    sails.log.info('An Event : ' + event + ' - was emitted');


}
module.exports.reportEvent = reportEvent;
