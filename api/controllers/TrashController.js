/**
 * TrashController
 *
 * @description :: Server-side logic for managing trashes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

//var each = require('async-each');


var eventObject = {};

module.exports = {


    'reportAnonymously': function(req,res){

//

//        var events = require('events');
//        var emitter = new events.EventEmitter();
//        emitter.on('Trash_Created',Common.reportEvent);



        var trashDetails = req.allParams();
        if(!trashDetails.latitude || !trashDetails.longitude){
            return res.badRequest('GPS Coordinates missing in request');
        }


        if(!trashDetails.trash_pic && sails.config.globals.trashPicMandatory){

            return res.badRequest('Please provide atleast one picture of the trash');
        }


        /* Logic here is
         - See if there is a near by trash (<1 km)
         - if yes, increase the noise levels of new and the above trashes.

         This would help to report that the area around 1km is really filled with garbage.
         */


//         function updateNearByTrashes(thisTrash){
//
//
//
//            function increaseNoiseAndSetClear(ntrash,cb){
//
//
//                console.log(ntrash);
//
//                if(!(ntrash.latitude == thisTrash.latitude && ntrash.longitude == thisTrash.longitude)){
//
//                    ntrash.noise ++;
//                    ntrash.cleared = false;
//
//                    ntrash.save(ntrash,function(err,savedTrash){
//
//                        if (err){
//                            sails.log.error('Error in increasing noise of a nearby trash');
//                            return cb(null);
//                        }
//                        else{
//                            sails.log.info('Noise ++');
//                            return cb(savedTrash);
//                        }
//
//
//                    });
//                }
//
//            }
//
//            var results = [];
//            var query = 'select * from nearbytrashes(' + thisTrash.longitude + ',' + thisTrash.latitude +',' + 4 +');'
//            console.log('Query: ' + query);
//            Trash.query(query,function(err,nTrashes){
//                if(err) {
//                    sails.log.warn('There was an error querying the near by trash' + err);
//                    return;
//                }
//                else
//                {
//
//                    nTrashes.rows.forEach(function(nTrash){
//                        increaseNoiseAndSetClear(nTrash,function(result){
//
//                            results.push(result);
//                            if(results.length == nTrash.length){
//
//                                return (results);
//                            }
//
//                        });
//
//                    });
//
//                }
//
//            });
//
//        }
//





        //Meanwhile create a new trash if doesn't exist.

        Trash.find({latitude:trashDetails.latitude, longitude:trashDetails.longitude}).exec(function(err,match){

            if(err){
                return res.badRequest('This trash is already reported. But failed to increase the noise level' + err);
            }
            else
            {
                if(match.length > 0 ){ // The user is reporting a trash which is already reported. Hence, just increase noise & update cleared satus

                   // increase noise level
                    var trashUpdate = match.pop();


                    trashUpdate.noise++;

                    if( trashUpdate.cleared){
                        trashUpdate.cleared = false
                    }

                    trashUpdate.save(function(err,updatedTrash){
                       if(err){
                           return res.serverError('Upadating the Trash status failed!' + err);
                       }
                       else{

                            eventObject.actor = 1;
                            eventObject.event = 'TrashStatusUpdated';

                            EventManager.reportEvent('TrashStatusUpdated',eventObject);

                            eventObject.event = 'TrashNoiseUpdated';
                            EventManager.reportEvent('TrashNoiseUpdated',eventObject);
                           return res.ok(updatedTrash);
                       }
                    });

                }
                else{ // There is no trash in the reported location. New one, hence just create it.
                    Trash.create(trashDetails, function createdNewTrash(err,newTrash){

                        if(err || !newTrash){
                            return res.badRequest('Failed to Report Trash.' + err);
                        }
                        else{
                             eventObject.event = 'TrashCreated';
                             eventObject.actor = 1;
                             EventManager.reportEvent('TrashCreated',eventObject);
                             return res.ok(newTrash);
                        }


                    });

                }

            }

        });


    },

    'report': function(req,res){


        var trashDetails = req.allParams();

        /*
            @TODO:: The below code removes an unwanted "id" attribute from the params. Need to find the route cause and fix
         */

        if(!trashDetails.id){
            delete trashDetails.id;

        }

        // @TODO:: End of TODO

        if(!trashDetails.latitude || !trashDetails.longitude){
            return res.badRequest('GPS Coordinates missing in request');
        }



        trashDetails.reporter_id = req.session.passport.user;

        if(!trashDetails.reporter_id){

            return res.badRequest('Hola! You might need to login/signup');
        }

        if(!trashDetails.trash_pic && sails.config.globals.trashPicMandatory){

            return res.badRequest('Please provide atleast one picture of the trash');
        }

        //Meanwhile create a new trash if doesn't exist.

        Trash.find({latitude:trashDetails.latitude, longitude:trashDetails.longitude}).exec(function(err,match){

            if(err){
                return res.badRequest('This trash is already reported. But failed to increase the noise level' + err);
            }
            else
            {
                if(match.length > 0 ){ // The user is reporting a trash which is already reported. Hence, just increase noise & update cleared satus

                    // increase noise level
                    var trashUpdate = match.pop();


                    trashUpdate.noise++;

                    if( trashUpdate.cleared){
                        trashUpdate.cleared = false
                    }

                    /* If this trash was reported anonimously, then updating the user id with the new user */

                    if(trashUpdate.reporter_id == 1 || trashUpdate.reporter_id == null)
                    {
                        trashUpdate.reporter_id = trashDetails.reporter_id
                    }

                    trashUpdate.save(function(err,updatedTrash){
                        if(err){
                            return res.serverError('Upadating the Trash status failed!' + err);
                        }
                        else{
                            eventObject.event = 'TrashStatusUpdated';
                            eventObject.actor = updatedTrash.reporter_id;
                            EventManager.reportEvent('TrashStatusUpdated',eventObject);
                            eventObject.event = 'TrashNoiseUpdated';
                            EventManager.reportEvent('TrashNoiseUpdated',eventObject);
                            return res.ok(updatedTrash);
                        }
                    });

                }
                else{ // There is no trash in the reported location. New one, hence just create it.
                    Trash.create(trashDetails, function createdNewTrash(err,newTrash){

                        if(!newTrash){
                            return res.badRequest('Failed to Report Trash.' + err);
                        }
                        else{
                            eventObject.event = 'TrashCreated';
                            eventObject.actor = newTrash.reporter_id;
                            EventManager.reportEvent('TrashCreated',eventObject);
                            return res.ok(newTrash);
                        }


                    });

                }

            }

        });


    },

    /*
     Function: Get the nearby trash
     */

    getTrashNearBy: function(req,res){
        var yourLoc = req.allParams();

        console.log(yourLoc);

        var query = 'select * from getactivetrashes(' + yourLoc.longitude + ',' + yourLoc.latitude +',' + 10 +');'


        Trash.query(query,function(err,trashes){

            if(err){return res.serverError(err);}
            return res.json(trashes.rows);
        });
    },


    getTrashByUser: function(req,res){

        try{


            Trash.find({reporter_id: req.session.passport.user}).sort('id DESC').exec(function(err,trashes){

                if(err){

                    return res.badRequest("Please check the data");
                }
                return res.ok(trashes);

            });
        }
        catch(ex){

            res.serverError(ex);
        }



    },

    markTrashClear: function(req,res){

        var params = req.allParams();
        console.log(params);
        Trash.findOne({latitude:params.latitude, longitude:params.longitude}).exec(function(err,trash){

            if(err){

                sails.log.error(err);
                return res.serverError(err);
            }
            if(trash){

                if(trash.cleared){

                    sails.log.warn('Already Cleaned');
                    return res.ok(trash);
                }
                else{

                    sails.log.warn('Setting the Trash status as cleared');
                    trash.cleared = true;
                    trash.noise = 0;
                    trash.save(function(err,clearedTrash){
                        if(err){
                            sails.log.error(err);
                            return res.serverError(err);
                        }
                        else
                        {
                            eventObject.event = 'TrashCleared';
                            eventObject.actor = req.session.passport.user;

                            EventManager.reportEvent('TrashCleared', eventObject);
                            eventObject.event = 'TrashNoiseUpdated';
                            EventManager.reportEvent('TrashNoiseUpdated',req.session.passport.user);
                            return res.ok(clearedTrash);
                        }

                    });


                }
            }
        });

    },

    getTrashByLocation: function(req,res){
        var location = req.allParams();

        if(!location.latitude || !location.longitude){

            return res.badRequest('No location provided');
        }

        Trash.find({latitude:location.latitude, longitude:location.longitude}).exec(function(err, trashes){

            if(err){
                sails.log.error('Error retrieving the Trash data: ' + err);
                return res.serverError();
            }
            else
            {
                return res.ok(trashes);
            }
        });

    },

    getTrashById: function(req,res){
        var trash = req.allParams();

        if(!trash.id){

            return res.badRequest('No trashId provided');
        }

        Trash.find({id:trash.id}).exec(function(err, trashes){

            if(err){
                sails.log.error('Error retrieving the Trash data: ' + err);
                return res.serverError();
            }
            else
            {
                return res.ok(trashes);
            }
        });

    },

    getAllTrashes: function(req,res){

        Trash.find().exec(function(err, trashes){

            if(err){
                sails.log.error('Error retrieving the Trash data: ' + err);
                return res.serverError();
            }
            else
            {
                return res.ok(trashes);
            }
        });

    }

};


