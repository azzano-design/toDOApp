"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

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

var users = {
  "user1": {
    id: "user1",
    email: "user@example.com",
    password: "123"
    //password: "$2a$10$4EMS7aLyrN71l9HV7igC9eG9pU1mJOzUPme6JzMsnWfyGX5AwcIWK"
  },
 "user2": {
    id: "user2",
    email: "user2@example.com",
    password: "123"
    //password: "$2a$10$HjnbCvHTr6UqRQy9g6Ec7.WTupfeBHRUFs4ciz//GzVE3/DH6FCGW"
  }
}


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
  res.render("index");
});

// Register Page
app.get('/register', (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  let id = generateRandomString();
  let firstName = req.body.firstname;
  let lastName = req.body.lastname;
  let email = req.body.email;
  let password = req.body.password;

  knex('users').insert({firstname: firstName, lastname: lastName, email: email, password: password})
  .then(function(results){
    res.redirect("/login");
  })
  .catch(function(err){
    console.log(err);
  })
})

// Login Page
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  let userEmail = req.body.email;
  let userPassword = req.body.password;

  console.log(userEmail)
  console.log(userPassword)

  res.redirect("/users");
})

// Dashboard Page
app.get("/users", (req, res) => {
  knex.select('*').from('users')
  .asCallback(function(err, results) {
    if(err) throw err;
    let templateVars = {
      users: results
    }
    res.render("dashboard", templateVars);
    console.log(results);
  })
});



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
