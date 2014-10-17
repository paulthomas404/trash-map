/**
 * OrganizationController
 *
 * @description :: Server-side logic for managing organizations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



    'new': function(req,res){

        var params = req.allParams();

        if(!params.name|| !params.email || !params.poc || !params.password){
            return res.badRequest('All fields are mandatory');
        }

        Organization.findOne({name:params.name}).exec(function(err,orgz){

            if(err){
                return res.serverError(err);
            }
            if(orgz){
                return res.badRequest('Organization with name' +"\"" + params.name + "\" already exists." );
            }
            else{

                Organization.create(params).exec(function(err,org){

                    if(err){
                        return res.serverError(err);
                    }
                    else
                    {
                        if(org){

                            return res.ok(org);
                        }
                        else
                        {
                            return res.badRequest('Could not create Org.');
                        }
                    }
                });
            }
        });



    }

};
