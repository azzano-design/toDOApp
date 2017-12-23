"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const cookieSession = require("cookie-session");
const bcrypt      = require('bcrypt');
const flash       = require('connect-flash');

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
app.use(flash());


// Mount all resource routes
app.use("/api/users", usersRoutes(knex));


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


// Home page
app.get("/", (req, res) => {
  let templateVars = {user: req.session.user};
  res.render("index", templateVars);
});

//add task to To-do list
app.post("/", (req, res) => {
  var task_name = req.body.searchBar;
  let user = req.session.user;
  let username = user.username;

  // console.log(user.id);

  knex.select('id').from('list').where('user_id', user.id).then((list_id) => {
    console.log("list_id", list_id);
  });



  // knex.select('id').from('list')
  // .then((list_id) => {
  //   var cat_id_promise = knex.select('id').from('categories');
  //   return Promise.all([list_id, cat_id_promise]);
  // })
  // .then(list_row => {
  //   var list_id = list_row[0];
  //   var category_id = list_row[1];
  //   console.log(list_row);
  //   console.log("test", task_name, list_id, category_id);
  //   // knex('list_task').insert({
  //   //   task_name,
  //   //   list_id,
  //   //   category_id
  //   // });
  //   res.redirect('/users/'+username);       // TODO: orly?

})




// Register Page
app.get('/register', (req, res) => {
  let templateVars = {user: req.session.user};
  res.render("register", templateVars);
});

app.post("/register", (req, res) => {
  let id = generateRandomString();
  let firstName = req.body.firstname;
  let lastName = req.body.lastname;
  let username = req.body.username;
  let email = req.body.email;



  if(!firstName || !lastName || !username || !email || !req.body.password) {
    res.redirect("/register");
    return;
  }
  knex('users').where({username: username}).orWhere({email: email}).then(function(users){
    if (users.length) {
      res.status(400).send('Username already exists!');
    } else {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          if (err) {
            console.log("bcrypt err:", err);
            res.status(500).send("oh god bcrypt has The Mummy's Curse, why oh why");
            return;
          }
          knex('users').insert({
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: hash,
            username: username
          })
          .then(function(results){
            res.redirect('/user/'+user.username);
          })
          .catch(function(err){
            console.log("database what now", err);
            res.status(500).send("database ain't based; prolly yo data was bad");
          })
        });
      });
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
    if (users.length) {
      let user = users[0];
      if (bcrypt.compareSync(userPassword, user.password)) {
        req.session.user = {id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, username: user.username};
        console.log(req.session.user);
        res.redirect('/users/'+user.username);
        return;
      } else {
        // pw didn't match the hashed-pass in the DB
        res.status(400).send('Email or Password are incorrect!');
        return;
      }
    } else {
      // no users found for this email
      res.status(400).send('Email or Password are incorrect!');
      return;
    }
  });
});

app.post("/users/:username", (req,res) => {



});



// Dashboard Page
app.get("/users/:username", (req, res) => {
  let templateVars = {user: req.session.user};
  if(req.session){
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
