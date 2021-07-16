const express = require('express');
const router = express.Router();
//bcrypt for password encryption 
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User Database Model
const UserModel = require("../models/User");

//Login Page
router.get('/login', (req,res) => res.render('login'));

//Register Page
router.get('/register', (req,res) => res.render('register'));

//Register Handler
router.post('/register', (req,res) => {
    const {name,email,password,password2} = req.body;
    let errors = [];

    //check required fields
    if(!name || !email || !password || !password2) {
        errors.push({msg: 'Please fill in all fields'});
    }

    //check passwords match
    if(password != password2) {
        errors.push({msg: 'Passwords do not match'});
    }

    //check password length is 6 characters long
    if(password.length < 6) {
        errors.push({msg: 'password should be at least 6 characters long'});
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //validation passes
        UserModel.findOne({email: email})
        .then(user => {
            if(user) {
                //if the user already exists
                errors.push({msg: 'a user with the mentioned email address already exists'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new UserModel({
                    name,
                    email,
                    password
                });
                
                //Hashing the User Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    //set password to hashed password
                    newUser.password = hash;

                    newUser
                    .save() //this method is very important
                    .then( user => {
                        req.flash('success_msg', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    })
                    .catch(err => console.log(err));
                }))


            }
        })
    }
});

//Login Handler
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});
module.exports = router;