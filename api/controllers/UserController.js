/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');


module.exports = {

    facebook: function(req, res, next) {
        passport.authenticate('facebook', { failureRedirect: '/signup', scope: ['email', 'public_profile'] }, function(err, user) {
            req.logIn(user, function(err) {
                if (err) {
                    res.view('500');
                    return;
                }

                res.redirect('/');
                return;
            });
        })(req, res, next);
    },

    'facebook/callback': function (req, res, next) {
        passport.authenticate('facebook',
            function (req, res) {
                res.redirect('/');
            })(req, res, next);
    },

    local: function(req, res, next)
    {
        passport.authenticate('local', function(err, user, info)
        {
            if ((err) || (!user)) {
                res.view('login', {error: 'Invalid username or password'});
                return;
            }

            req.logIn(user, function(err) {
                if (err) {
                    res.view('login', {error: 'There was an error logging in with the supplied credentials'});
                    return;
                }

                res.redirect('/');
                return;
            });
        })(req, res, next);
    },

    signup: function(req, res, next) {
        var userData = req.allParams();
        if(userData != null || typeof userData != 'undefined' )
            if(!userData.email || !userData.password || !userData.name)
                res.view('signup', {error: 'Invalid user data provided. Try Again'});
        User.findOne({ email: userData.email }).exec(function(err, user) {
            if (user) {
                res.view('login', {error: 'User with the same email exists. Login Here'});
                return;
            } else {
                User.create({
                    full_name:  userData.name,
                    email: userData.email,
                    password: userData.password
                }).exec(function (err, user) {
                    if (user) {

                        req.logIn(user, function(err) {
                            if (err) {
                                res.view('signup', {error: 'There was an error logging in with the supplied credentials'});
                                return;
                            }

                            res.redirect('/');
                            return;
                        });

                    } else {
                        res.view('signup', {error: err});
                        return;
                    }
                });
            }
        });

    },

    logout: function(req,res){
        req.logOut();
        res.redirect('/');
        return;
    }



};


