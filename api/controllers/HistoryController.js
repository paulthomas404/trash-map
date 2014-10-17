/**
 * HistoryController
 *
 * @description :: Server-side logic for managing histories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var globalConfigs = sails.config.globals;

module.exports = {

    getMyActivities: function(req,res){

        var params = req.allParams();

        if(!req.session.passport.user)
        {
            sails.log.error('No User Id Supplied');
            return res.badRequest('No User Id Supplied. Please login to re-authenticate');
        }



        History.find().where({module:'Trash', actor:req.session.passport.user}).sort('id DESC').exec(function(err,myActivities){

            if(err){
                sails.log.error('Unable to search activity log for user');
                return res.serverError(err)
            }
            return res.ok(myActivities);

        });


    }
	
};

