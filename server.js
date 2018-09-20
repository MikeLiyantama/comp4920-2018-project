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

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'Johnson4920';

passport.use( new JwtStrategy(opts, function(jwt_payload, done){
  return db.collection(USERS_COLLECTION).findOne({ _id : ObjectID(jwt_payload._id)}, function(err, user){
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
app.use(cors({ origin: '*' }));
app.use(cors({
  origin: [
    'https://comp4920-organiser.herokuapp.com',
    'http://localhost:4200',
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

app.put('/api/register', function(req, res) {
  if(req.body.email && req.body.password) {
      var obj = {email: req.body.email, password: req.body.password};
      db.collection(USERS_COLLECTION).findOne({email : req.body.email}, function(err, result){
        if(result){ // Existing user with same email found
            res.status(200).json({success: false, message: "email has been used in another account"});
        } else{
          db.collection(USERS_COLLECTION).insertOne(obj, function (err, result) {
            if (err) res.status(200).json({success: false, message: "database error"});        //DB Error
            else res.status(200).json({success: true, message: "registration successful"});
          });
        }
      });   
  } else res.status(400).json({success: false, message: "Must provide email and password"});
});

/**
 * TASKS
 */

var TASKS_COLLECTION = 'TASKS';

app.post('/api/task', function (req, res) {
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
});

app.get('/api/task', function (req, res) {
    db.collection(TASKS_COLLECTION).find({}).toArray(function (err, docs) {
      if (err) {
        returnError(res, err.message, "Failed to retieve tasks");
      } else {
        res.status(200).json(docs);
      }
    });
});
  
app.get('/api/task/:id', function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TASKS_COLLECTION).findOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
      if (err) {
        returnError(res, err.message, "Failed to retieve task");
      } else {
        if (doc) {
          res.status(200).json(doc);
        } else {
          returnError(res, 'No task found', 'No task found', 404);
        }
      }
    });
  } else {
    returnError(res, 'Invalid user input', 'Invalid task ID', 400);
  }
});

app.put('/api/task/:id', function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TASKS_COLLECTION).updateOne({ _id: ObjectID(req.params.id) }, { $set: req.body }, function (err, result) {
      if (err) {
        returnError(res, err.message, "Failed to update task");
      } else if (result.result.n === 1) {
        res.status(204).send({});
      } else {
        returnError(res, 'No task found', 'No task found', 404);
      }
    })
  } else {
    returnError(res, 'Invalid user input', 'Invalid task ID', 400);
  }
});

//Endpoints with auth

app.post('/api/task_with_auth', passport.authenticate('jwt', { session: false}), function (req, res) {
  let token =  jwt.decode(ExtractJwt.fromAuthHeaderAsBearerToken());
  var newTask = req.body;
  newTask.createdAt = new Date();
  newTask.createdBy = token._id;

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
});

app.get('/api/task_with_auth', passport.authenticate('jwt', { session: false}), function (req, res) {
  let token =  jwt.decode(ExtractJwt.fromAuthHeaderAsBearerToken());
  db.collection(TASKS_COLLECTION).find({_id : ObjectID(token._id)}).toArray(function (err, docs) {
    if (err) {
      returnError(res, err.message, "Failed to retieve tasks");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.get('/api/task_with_auth/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
if (ObjectID.isValid(req.params.id)) {
  db.collection(TASKS_COLLECTION).findOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
    if (err) {
      returnError(res, err.message, "Failed to retieve task");
    } else {
      if (doc) {
        res.status(200).json(doc);
      } else {
        returnError(res, 'No task found', 'No task found', 404);
      }
    }
  });
} else {
  returnError(res, 'Invalid user input', 'Invalid task ID', 400);
}
});

app.put('/api/task_with_auth/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
if (ObjectID.isValid(req.params.id)) {
  db.collection(TASKS_COLLECTION).updateOne({ _id: ObjectID(req.params.id) }, { $set: req.body }, function (err, result) {
    if (err) {
      returnError(res, err.message, "Failed to update task");
    } else if (result.result.n === 1) {
      res.status(204).send({});
    } else {
      returnError(res, 'No task found', 'No task found', 404);
    }
  })
} else {
  returnError(res, 'Invalid user input', 'Invalid task ID', 400);
}
});

/** 
 * Teams
*/
let TEAMS_COLLECTION = 'teams';

/**
 * Create team
 */
app.post('/api/team', passport.authenticate('jwt', {session: false}), function (req, res) {
  let token =  jwt.decode(ExtractJwt.fromAuthHeaderAsBearerToken());
  
  var newTeam = req.body;
  newTeam.createdAt = new Date();
  newTeam.members = token._id;
  if (!req.body.title) {
    returnError(res, 'Invalid user input', 'Must provide a title', 400);
  } else {
    db.collection(TEAMS_COLLECTION).insertOne(newTeam, function (err, doc) {
      if (err) {
        returnError(res, err.message, "Failed to create new team");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/**
 * Get all teams by id
 */

app.get('/api/team' , passport.authenticate('jwt', {session: false}), function (req, res) {
  let token =  jwt.decode(ExtractJwt.fromAuthHeaderAsBearerToken());
  db.collection(TEAMS_COLLECTION).find({members : token._id}).toArray(function (err, docs) {
    if (err) {
      returnError(res, err.message, "Failed to retieve teams");
    } else {
      res.status(200).json(docs);
    }
  });
});

/**
 * Get specific team
 */

app.get('/api/team/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
if (ObjectID.isValid(req.params.id)) {
  db.collection(TEAMS_COLLECTION).findOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
    if (err) {
      returnError(res, err.message, "Failed to retieve teams");
    } else {
      if (doc) {
        res.status(200).json(doc);
      } else {
        returnError(res, 'No team found', 'No team found', 404);
      }
    }
  });
} else {
  returnError(res, 'Invalid user input', 'Invalid team ID', 400);
}
});

/**
 * update team
 */

app.put('/api/team/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
if (ObjectID.isValid(req.params.id)) {
  db.collection(TEAMS_COLLECTION).updateOne({ _id: ObjectID(req.params.id)}, { $set: req.body }, function (err, result) {
    if (err) {
      returnError(res, err.message, "Failed to update teams");
    } else if (result.result.n === 1) {
      res.status(204).send({});
    } else {
      returnError(res, 'No team found', 'No team found', 404);
    }
  })
} else {
  returnError(res, 'Invalid user input', 'Invalid team ID', 400);
}
});


/** 
 * Team members
*/

/**
 * Create new team member
 */
app.put('/api/team/member', passport.authenticate('jwt', {session: false}), function(req, res){
  db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.body.id)}, {$push :{members : req.body._id}}, function(err, result){
    if (err){
      returnError(res, err.message, "Failed to add member");
    } else{
      res.status(200).json({success: true});
    }
  })
})

/**
 * Remove a user from team
 */
app.delete('/api/team/member', passport.authenticate('jwt', {session: false}), function(req, res){
  db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.body.id)}, {$pull :{members : req.body._id}}, function (err, result){
    if (err){
      returnError(res, err.message, "Failed to delete member");
    } else{
      res.status(200).json({success: true});
    }
  });
});
