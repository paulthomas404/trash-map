/**
 * EventsController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    'new': function(req,res){


        var params = req.allParams();
        if(params.trashes.length == 0 ){

            return res.badRequest('Please select atleast one Trash to clean');
        }

        isThisEventOverlapping(function(match){


            if(match.length > 0){

                return res.forbidden(match);

            }
            else{

                // Create a new Event.
                sails.log.info('Creating new Event');
                var event = new Object();
                event.name = params.name;
                event.org_id = params.organization;
                event.contact_phone = params.contact_phone;
                event.contact_email = params.contact_email;
                event.event_start_date = params.event_start_date;
                event.event_end_date = params.event_end_date;
                event.meet_at = params.meet_at;
                event.remarks = params.remarks;
                event.status = null;

                try {

                    Events.create(event).exec(function (err, newEvent) {

                        if (err) {

                            return res.serverError(err);
                        }

                        var trashes =[];
                        trashes = params.trashes;

                        var trashes_events = [];

                        for (var trashId =0;trashId <trashes.length;trashId++){
                            console.log(trashes[trashId]);
                            Eventrash.create({trash_id: trashes[trashId], event_id:newEvent.id}).exec(function(err,newTrashEvent){
                                if(err){

                                    //Delete the event as well.
                                    sails.log.error('Error creating event trash' + err);
                                    Events.destroy({name:newEvent.name}).exec(function(err,destoryedRec){

                                        if(err){

                                            return res.serverError("Event created, but trashes not!" + err)
                                        }

                                        return res.serverError(err);

                                    });

                                }
                                else{

                                    trashes_events.push(newTrashEvent);
                                    if(trashes_events.length == trashes.length){
                                        return res.ok(trashes_events);
                                    }
                                }



                            });



                        }


                    });
                }
                catch(ex)
                {
                    return res.serverError(ex);
                }
            }


        });



        function isThisEventOverlapping(cb) {


            if (!params.name || !params.organization || !params.trashes||!params.event_start_date || !params.event_end_date) {

                cb(null);
            }




            try {
                    var query = 'SELECT getoverlappingevents(\'' +
                        params.event_start_date + "'::date, array[" + params.trashes + "]::integer[]);"


                    Events.query(query, function (err, match) {

                        if (err) {
                            sails.log.error('Error: ' + err);
                            cb(null);
                        }
                        if (match) {


                            cb(match.rows);

                        }

                        else {
                            cb(null);
                        }
                    });
                }
            catch(ex){
                return res.serverError(ex)
            }
        }


    }
};

