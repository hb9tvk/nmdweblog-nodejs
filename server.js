const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const fileUpload = require('express-fileupload');

const users = [
  {id: 'hb9tvk', email: 'test@test.com', password: 'password'}
]

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    console.log('Inside local strategy callback')
    // here is where you make a call to the database
    // to find the user based on their username or email address
    // for now, we'll just pretend we found that it was users[0]
    const user = users[0] 
    if(email === user.email && password === user.password) {
      console.log('Local strategy returned true')
      return done(null, user)
    } else {
      return done(null, false, { message: 'Invalid credentials.\n' });
    }
  }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id is save to the session file store here')
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback')
  console.log(`The user id passport saved in the session file store is: ${id}`)
  const user = users[0].id === id ? users[0] : false; 
  done(null, user);
});


const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
  credentials: true
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    genid: (req) => {
      console.log('Inside the session middleware')
      console.log(req.sessionID)
      return uuidv4() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session());
// app.use(fileUpload());

app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp',
  debug: false
}));

// simple route
app.get("/", (req, res) => {
  console.log('Inside the homepage callback function')
  console.log(req.sessionID)
  res.send(`You got home page!\n`)
});

app.post('/api/login', (req, res, next) => {
  console.log('in login');
  console.log(req.body);
  passport.authenticate('local', (err, user, info) => {
    if (info) {return res.send(info.message)}
    if (err) { return next(err); }
    if (!user) { return res.send(info.message); }
    req.login(user, (err) => {
      if (err) { return next(err); }
      return res.send('login ok');
    })
  })(req, res, next);
})

app.get('/api/getUser', (req,res) => {
  console.log(req.sessionID)
  if (req.isAuthenticated()) {
    return res.send(req.user.id);
  } else {
    res.status(401);
    return res.send('not authenticated');
  }
})

app.get('/api/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


require("./app/routes/nmdlog.routes")(app);
require("./app/routes/stn.routes")(app);

const db = require("./app/models");
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
  });


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});