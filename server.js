"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieSession = require("cookie-session");

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET_KEY || "some secret key"]
}));


function generateRandomString() {
  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUWVXYZ';
  alphabet = alphabet + alphabet.toLowerCase() + '0123456789';
  let randomString = '';
  for(var i = 0 ; i < 6; i++) {
    var index = Math.floor(Math.random() * alphabet.length);
    randomString += alphabet[index];
  }
  return randomString;
}

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  let templateVars = {user: req.session.user};
  res.render("index", templateVars);
});

// Register Page
app.get('/register', (req, res) => {
  let templateVars = {user: req.session.user};
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  let id = generateRandomString();
  let firstName = req.body.firstname;
  let lastName = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;

  knex('users').where({email: email}).then(function(users){
    if(users.length) {
      res.status(400).send('Email already exists!');
    } else {
      knex('users').insert({firstname: firstName, lastname: lastName, email: email, password: password})
      .then(function(results){
        res.redirect("/login");
      })
      .catch(function(err){
        console.log(err);
      })
    }
  })
})

// Login Page
app.get("/login", (req, res) => {
  let templateVars = {user: req.session.user};
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  let userEmail = req.body.email;
  let userPassword = req.body.password;
  const cookiename = req.session;



  knex('users').where({email: userEmail}).then(function(users){
    if(users.length) {
      let user = users[0];
      if(user.password === userPassword) {
        req.session.user = {id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email};
        console.log(req.session.user);
        res.redirect('/users/'+user.id);
        return;
      } else {
        res.status(400).send('Email or Password are incorrect!');
        return;
      }
    }
    res.status(400).send('Email does not exist!');    //
  })
})

// Dashboard Page
app.get("/users/:id", (req, res) => {
  if(req.session){
    let templateVars = {user: req.session.user};
    res.render("dashboard",templateVars);
    return;
  }
  res.redirect("/login");
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
})



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
