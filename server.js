var express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors');

var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var app = express();

//Passport middleware configuration

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
  },
  function(username, password, done){
    return db.collection(USERS_COLLECTION).findOne({email, password}, function(err, user){
      if (err){
        return done(err, false, {success: false, message : 'Wrong email or password'});
      } if (user){
        return done(null, user, {success: true});
      } else {
        return done(null, false, {success: false, message: 'Must provide email and password'});
      }
    });
  }
))

passport.use( new JwtStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : 'Johnson4920'
}, function(jwt_payload, done){
  return db.collection(USERS_COLLECTION).findOne({ id : jwt_payload.id}, function(err, user){
    if (err){
      return done(err, false);
    } if (user){
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));



// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: [
    'https://comp4920-organiser.herokuapp.com',
    'localhost',
  ],
}));

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

// API Routers


// error handler
function returnError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

/**
  USERS
 */

var USERS_COLLECTION = 'USERS';

app.post('/api/auth', function(req, res) {
    if (req.body.email && req.body.password) { // Field Check
        db.collection(USERS_COLLECTION).findOne({ email: req.body.email }, function (err, result) {
            if (result) {
                if (req.body.password == result.password) {
                  var token = jwt.sign(result, 'Johnson4920');
                  res.status(200).json({ success: true, token: token});
                } else {
                  res.json({ success: false });
                }
            } else {
                res.status(200).json({success: false});
            }
        });
    } else {
      returnError(res, 'Invalid user input', 'Must provide email and password', 400);
    }
});

/**
  TASKS
 */

var TASKS_COLLECTION = 'TASKS';

app.post('/api/task', passport.authenticate('jwt', { session: false}), function (req, res) {
  let token = parseToken(req.headers);
  if (token){
    var newTask = req.body;
    newTask.createdAt = new Date();

    if (!req.body.title) {
      returnError(res, 'Invalid user input', 'Must provide a title', 400);
    } else {
      db.collection(TASKS_COLLECTION).insertOne(newTask, function (err, doc) {
        if (err) {
          returnError(res, err.message, "Failed to create new task");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });
    }
  } else {
    returnError(res, 'Unauthorized request', 'Unauthorized', 403);
  }
});

app.get('/api/task', passport.authenticate('jwt', { session: false}), function (req, res) {
  let token = parseToken(req.headers);
  if (token){
    db.collection(TASKS_COLLECTION).find({}).toArray(function (err, docs) {
      if (err) {
        returnError(res, err.message, "Failed to retieve tasks");
      } else {
        res.status(200).json(docs);
      }
    });
  } else {
    returnError(res, 'Unauthorized request', 'Unauthorized', 403);
  }
});


//Helper function

parseToken = function (header){
  if(header && header.authorization){
    var parted = headers.authorization.split(' ');
    if(parted.length === 2){
      return parted[1];
    }else {
      return null;
    }
  }else {
    return null;
  }
}