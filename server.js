// Imports

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
  ******************************** USERS ********************************
 */

var USERS_COLLECTION = 'USERS';

// Authenticate user
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

// Create user
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

// Get all users (with auth)
app.get('/api/users', passport.authenticate('jwt', {session: false}), function (req, res) {
  db.collection(USERS_COLLECTION).find({}, {_id:1}, function (err, result) {
    if (result) {
      res.status(200).json(result);
    } else {
      returnError(res, err.message, "Failed to retrieve users");
    }
  });
});

// Get current user (with auth)
app.get('/api/me', passport.authenticate('jwt', {session: false}), function (req, res) {
  res.status(200).json({"currUser": token._id});
});

/**
 * ******************************** TASKS ********************************
 */

var TASKS_COLLECTION = 'TASKS';

// Create task
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

// Get all tasks
app.get('/api/task', function (req, res) {
    db.collection(TASKS_COLLECTION).find({}).toArray(function (err, docs) {
      if (err) {
        returnError(res, err.message, "Failed to retieve tasks");
      } else {
        res.status(200).json(docs);
      }
    });
});

// Get task with specific id
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

// Update task with specific id
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
    });
  } else {
    returnError(res, 'Invalid user input', 'Invalid task ID', 400);
  }
});

/**
 * **************************** TASKS WITH AUTH ****************************
 */

// Create task
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

// Get all tasks owned by the user
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

// Get task with specific id
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

// Update task with specific id
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
 * **************************** TEAMS WITH AUTH ****************************
 */

let TEAMS_COLLECTION = 'teams';

// Create team
app.post('/api/team', passport.authenticate('jwt', {session: false}), function (req, res) {
  let token =  jwt.decode(ExtractJwt.fromAuthHeaderAsBearerToken());
  
  var newTeam = req.body;
  newTeam.createdAt = new Date();
  newTeam.createdBy = token._id;
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

// Get all teams a user is in
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

// Get team with specific id
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

// Delete team with specific id
app.delete('/api/team/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    // Check if the team is valid
    db.collection(TEAMS_COLLECTION).findOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
      if (err) {
        returnError(res, err.message, "Failed to delete team");
      } else {
        if (doc) {
          // A team can only be deleted by its creator
          if (doc.createdBy === token._id) {
            db.collection(TEAMS_COLLECTION).deleteOne({ createdBy: token._id }, function (err, doc2) {
              if (err) {
                returnError(res, err.message, "Failed to delete team");
              } else {
                if (doc.deletedCount > 0) {
                  res.status(200).json(doc);
                } else {
                  returnError(res, 'No team found', 'No team found. Warning: this clause should not be reached.', 404);
                }
              }
            });
          } else {
            returnError(res, 'Forbidden', 'Only the creator could delete a team', 403);
          }
        } else {
          returnError(res, 'No team found', 'No team found', 404);
        }
      }
    });
  } else {
    returnError(res, 'Invalid user input', 'Invalid team ID', 400);
  }
});

// Update a team
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
    });
  } else {
    returnError(res, 'Invalid user input', 'Invalid team ID', 400);
  }
});

// Add the current user, or a specific user to a team
app.put('/api/team/:id/member', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    if("_id" in req.body) {
      db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$push :{members : req.body._id}}, function(err, doc){
        if (err){
          returnError(res, err.message, "Failed to add member");
        } else{
          res.status(200).json(doc);
        }
      });
    } else {
      db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$push :{members : token._id}}, function(err, doc){
        if (err){
          returnError(res, err.message, "Failed to add member");
        } else{
          res.status(200).json(doc);
        }
      });
    }
    
  } else {
    returnError(res, 'No team found', 'No team found', 404);
  }
});

// Remove the current user, or a specific member from a team
app.delete('/api/team/:id/member', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    if("_id" in req.body) {
      db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$pull :{members : req.body._id}}, function(err, doc){
        if (err){
          returnError(res, err.message, "Failed to delete member");
        } else{
          res.status(200).json(doc);
        }
      });
    } else {
      db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$pull :{members : token._id}}, function(err, doc){
        if (err){
          returnError(res, err.message, "Failed to delete member");
        } else{
          res.status(200).json(doc);
        }
      });
    }
    
  } else {
    returnError(res, 'No team found', 'No team found', 404);
  }
});

// Add a list to a team
app.put('/api/team/:id/list', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$push :{lists : req.body._id}}, function(err, doc){
      if (err){
        returnError(res, err.message, "Failed to add list");
      } else{
        res.status(200).json(doc);
      }
    });
  } else {
    returnError(res, 'No team found', 'No team found', 404);
  }
});

// Remove a list from a team
app.delete('/api/team/:id/list', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$pull :{lists : req.body._id}}, function(err, doc){
      if (err){
        returnError(res, err.message, "Failed to delete list");
      } else{
        res.status(200).json(doc);
      }
    });
  } else {
    returnError(res, 'No team found', 'No team found', 404);
  }
});

/**
 * ************************ LISTS ************************
 */

let LISTS_COLLECTION = 'lists';

// Create list
app.post('/api/list', passport.authenticate('jwt', {session: false}), function (req, res) {
  let token =  jwt.decode(ExtractJwt.fromAuthHeaderAsBearerToken());
  
  var newList = req.body;
  newList.createdAt = new Date();
  newList.createdBy = token._id;
  if (!req.body.title) {
    returnError(res, 'Invalid user input', 'Must provide a title', 400);
  } else {
    db.collection(LISTS_COLLECTION).insertOne(newList, function (err, doc) {
      if (err) {
        returnError(res, err.message, "Failed to create new list");
      } else {
        db.collection(USERS_COLLECTION).updateOne({_id : token._id}, {$push :{lists : doc._id}}, function(err, doc2){
          if (err){
            returnError(res, err.message, "Failed to create new list");
          } else{
            res.status(201).json(doc);
          }
        });
      }
    });
  }
});

// Get all lists a user has created
app.get('/api/list' , passport.authenticate('jwt', {session: false}), function (req, res) {
  let token =  jwt.decode(ExtractJwt.fromAuthHeaderAsBearerToken());
  db.collection(LISTS_COLLECTION).find({createdBy : token._id}).toArray(function (err, docs) {
    if (err) {
      returnError(res, err.message, "Failed to retieve lists");
    } else {
      res.status(200).json(docs);
    }
  });
});

// Get a list with specific id
app.get('/api/list/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    db.collection(LISTS_COLLECTION).findOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
      if (err) {
        returnError(res, err.message, "Failed to retieve list");
      } else {
        if (doc) {
          res.status(200).json(doc);
        } else {
          returnError(res, 'No list found', 'No list found', 404);
        }
      }
    });
  } else {
    returnError(res, 'No list found', 'No list found', 404);
  }
});

// Delete list with specific id
app.delete('/api/list/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    // Check if the list is valid
    db.collection(LISTS_COLLECTION).findOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
      if (err) {
        returnError(res, err.message, "Failed to delete list");
      } else {
        if (doc) {
          // A list can only be deleted by its creator
          if (doc.createdBy === token._id) {
            db.collection(USERS_COLLECTION).updateOne({_id : token._id}, {$pull :{lists : doc._id}}, function(err, doc2){
              if (err) {
                returnError(res, err.message, "Failed to delete list");
              } else {
                db.collection(LISTS_COLLECTION).deleteOne({ createdBy: token._id }, function (err, doc2) {
                  if (err) {
                    returnError(res, err.message, "Failed to delete list");
                  } else {
                    if (doc.deletedCount > 0) {
                      res.status(200).json(doc);
                    } else {
                      returnError(res, 'No list found', 'No list found. Warning: this clause should not be reached.', 404);
                    }
                  }
                });
              }
            });
          } else {
            returnError(res, 'Forbidden', 'Only the creator could delete a list', 403);
          }
        } else {
          returnError(res, 'No list found', 'No list found', 404);
        }
      }
    });
  } else {
    returnError(res, 'No list found', 'No list found', 404);
  }
});

// Update a list
app.put('/api/list/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    db.collection(LISTS_COLLECTION).updateOne({ _id: ObjectID(req.params.id)}, { $set: req.body }, function (err, result) {
      if (err) {
        returnError(res, err.message, "Failed to update list");
      } else if (result.result.n === 1) {
        res.status(204).send({});
      } else {
        returnError(res, 'No list found', 'No list found', 404);
      }
    });
  } else {
    returnError(res, 'No list found', 'No list found', 404);
  }
});

// Add a task to a list
app.put('/api/list/:id/task', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    db.collection(LISTS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$push :{tasks : req.body._id}}, function(err, doc){
      if (err){
        returnError(res, err.message, "Failed to add task");
      } else{
        res.status(200).json(doc);
      }
    });
  } else {
    returnError(res, 'No list found', 'No list found', 404);
  }
});

// Delete a task from a list
app.delete('/api/list/:id/task', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    db.collection(LISTS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$pull :{tasks : req.body._id}}, function(err, doc){
      if (err){
        returnError(res, err.message, "Failed to delete task");
      } else{
        res.status(200).json(doc);
      }
    });
  } else {
    returnError(res, 'No list found', 'No list found', 404);
  }
});
