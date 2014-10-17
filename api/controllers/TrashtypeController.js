/**
 * TrashtypeController
 *
 * @description :: Server-side logic for managing trashtypes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    addType: function(req,res){

        var name = req.allParams();
        Trashtype.create(name,function(err,newType){
            if(err){
                sails.log.error(err);
                return res.serverError(err);
            }
            if(newType){

                sails.log.info('New Type Created');
                return res.ok(newType);

            }
        });

    }

};

