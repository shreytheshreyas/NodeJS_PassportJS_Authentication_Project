const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//passprot config
require('./config/passport')(passport)

// Database Configuration 
const database = require('./config/keys');

//Connecting to MongoDB
mongoose.connect(database.MongoURI, {useNewUrlParser: true, useCreateIndex: true ,useUnifiedTopology: true})
.then(() => console.log('MongoDB connected ......'))
.catch(err => console.log(err));


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Express - Bodyparser
app.use(express.urlencoded({ extended: false}));

//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

//global variables 
app.use((req, res, next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes 
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));