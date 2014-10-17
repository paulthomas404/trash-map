var passport = require('passport'),
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');

function findById(id, fn) {
    User.findOne(id).exec(function (err, user) {
        if (err) {
            return fn(null, null);
        } else {
            return fn(null, user);
        }
    });
}

function findByFacebookId(id, fn) {
    User.findOne({
        facebook_id: id
    }).exec(function (err, user) {
        if (err) {
            return fn(null, null);
        } else {
            return fn(null, user);
        }
    });
}

function findByEmail(email, fn) {
    User.findOne({
        email: email
    }).exec(function (err, user) {
        if (err) {
            return fn(null, null);
        } else {
            return fn(null, user);
        }
    });
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
        clientID: sails.config.accounts.facebook.clientID,
        clientSecret: sails.config.accounts.facebook.clientSecret,
        callbackURL: "http://localhost:1337/user/facebook/callback",
        enableProof: false
    }, function (accessToken, refreshToken, profile, done) {

        findByFacebookId(profile.id, function (err, user) {

            if (!user) {
                User.create({
                    full_name:  profile.displayName,
                    email: profile.emails[0].value,
                    facebook_id: profile.id
                }).exec(function (err, user) {
                    if (user) {
                        return done(null, user, {
                            message: 'Logged In Successfully'
                        });
                    } else {
                        return done(err, null, {
                            message: 'There was an error logging you in with Facebook'
                        });
                    }
                });

            } else {
                return done(null, user, {
                    message: 'Logged In Successfully'
                });
            }
        });
    }
));

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.findOne({ email: email }).exec(function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user ' + email }); }
            bcrypt.compare(password, user.password, function (err, res) {
                if (!res)
                    return done(null, false, {
                        message: 'Invalid Password'
                    });
                return done(null, user, {
                    message: 'Logged In Successfully'
                });
            });
        });
    }
));

