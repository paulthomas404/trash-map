/**
 * Created by root on 26/9/14.


//Define how we are going to see if the user is authenticated to do an action.
    /*
        1. If the session.user = req.user.id
        2. There is a valid session in the redis for this user

     */

    /*
        We need to have a strategy to authenticate mobile request, as the same wont have a session token to give :)


     */



    /**
     * Allow any authenticated user.
     */
    module.exports = function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        else return res.view('403');
    };
