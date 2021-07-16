const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User Model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ 
            usernameField: 'email' }, 
            (email, password, done) => {
                //Match entered user with a user in the database
                User.findOne({email: email})
                .then(user => {
                    //If user does not exist
                    if (!user) {
                        return done(null, false, {message: 'That email is not registered'})
                    }
                    
                    //Match Password
                    bcrypt.compare(password, user.password, (err, isMatchSuccess) => {
                        if (err) throw err;

                        if(isMatchSuccess) {
                            return done(null,user);
                        } else {
                            return done(null, false, {message: 'Password is Incorrect'});
                        }
                    });
                })
                .catch(err => console.log(err));
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
} 