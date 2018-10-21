// Imports

var express = require("express");
var bodyParser = require("body-parser");
var cors = require('cors');
var path = require('path');
var _ = require('lodash');
var secure = require('ssl-express-www')
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var app = express();

// Middleware
app.use(secure);
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 10000 }));

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
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://heroku_5x9x11zk:59207vr4nj87o5uetbq6q7pqgj@ds245772.mlab.com:45772/heroku_5x9x11zk", function (err, client) {
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

// Passport middleware configuration
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
                  var unsigned_token = result;
                  unsigned_token.profile = "";
                  unsigned_token.password = "";
                  var token = jwt.sign(unsigned_token, 'Johnson4920');
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
      var obj = req.body;
      console.log ("RECEIVED OBJECT:");
      console.log (obj);
      db.collection(USERS_COLLECTION).findOne({email : req.body.email}, function(err, result){
        if(result){ // Existing user with same email found
            res.status(200).json({success: false, message: "email has been used in another account"});
        } else{
          db.collection(USERS_COLLECTION).insertOne(obj, function (err, result) {
            if (err) res.status(200).json({success: false, message: "database error"});        //DB Error
            else {
              const token = jwt.sign(obj, 'Johnson4920');
              res.status(201).json({success: true, token});
            }
          });
        }
      });   
  } else res.status(400).json({success: false, message: "Must provide email and password"});
});

// Get all users (with auth)
app.get('/api/users', passport.authenticate('jwt', {session: false}), function (req, res) {
  db.collection(USERS_COLLECTION).find({}, {_id:1}).toArray(function (err, result) {
    if (result) {
      res.status(200).json(result);
    } else {
      returnError(res, err.message, "Failed to retrieve users");
    }
  });
});

// Get current user (with auth)
app.get('/api/me', passport.authenticate('jwt', {session: false}), function (req, res) {
  res.status(200).json({"currUser": req.user._id});
});


//Get user data by user id param
app.get('/api/account/data/:id', passport.authenticate('jwt', {session: false}), function(req, res){
  db.collection(USERS_COLLECTION).findOne({_id: ObjectID(req.params.id)}, function(err, doc){
    if(doc == null || err){
      returnError(res, "User not Found", "User not Found", 400);
    } else {
      res.status(200).json(doc);
    }
  })
})


//change user data by token ID
app.put('/api/account/data', passport.authenticate('jwt', {session: false}), function(req, res){
  db.collection(USERS_COLLECTION).updateOne({_id: ObjectID(req.user._id)}, {$set : req.body}, function(err, doc){
    if(doc == null || err){
      returnError(res, "User not Found", "User not Found", 400);
    } else {
      res.status(200).json({success:true});
    }
  })
})

//Check user if exists by email
app.get('/api/account/check/:email', function(req, res) {
  db.collection(USERS_COLLECTION).findOne({email : req.params.email}, function(err, doc) {
    if(doc == null){
      returnError(res, "Account not Found", "Account not Found", 400);
    } else {
      res.status(200).json({success : true});
    }
  });
});

//Change user data by email param
app.put('/api/account/change/:email', function(req, res) { 
  db.collection(USERS_COLLECTION).updateOne({email: req.params.email}, { $set: req.body }, function (err, doc){
    if (err){
      returnError(res, err, "Cannot update credential", 400);
    } else {
      res.json({success : true});
    }
  })
});

//Get account data by token ID
app.get('/api/account/data', passport.authenticate('jwt', {session: false}), function(req, res){
  db.collection(USERS_COLLECTION).findOne({_id: ObjectID(req.user._id)}, function(err, doc){
    if(doc == null || err){
      returnError(res, "User not Found", "User not Found", 400);
    } else {
      res.status(200).json(doc);
    }
  })
})

//Send email verification, returns verification code
app.post('/api/account/email_verification', function(req, res){
  db.collection(USERS_COLLECTION).findOne({email : req.body.email}, function(err, doc){
    if(err){
      returnError(res, "Account not Found", "Account Not Found", 400);
    } else{
      let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'organiser.me@gmail.com',
            pass: 'Johnson4920'
          }
      });
      var randomCode = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); //https://gist.github.com/6174/6062387
      randomCode = randomCode.substring(0,10);
      let mailOptions = {
        from: 'organiser.me@gmail.com',
        to: req.body.email,
        subject: 'Password Change Request',
        text: randomCode
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          returnError(res, "Error occured when sending email", "Error occured when sending email", 400);
        } else {
          console.log('Email sent: ' + info.response); //DEBUG
          res.status(200).json({success: true, code: randomCode});
        }
      });
    }
  })
});


/**
 * ************************ LISTS ************************
 */

let LISTS_COLLECTION = 'LISTS';

// Create list
app.post('/api/list', passport.authenticate('jwt', {session: false}), function (req, res) {
  var newList = req.body;
  newList.createdAt = new Date();
  newList.createdBy = req.user._id;
  if (!req.body.title) {
    returnError(res, 'Invalid user input', 'Must provide a title', 400);
  } else {
    db.collection(LISTS_COLLECTION).insertOne(newList, function (err, doc) {
      if (err) {
        returnError(res, err.message, "Failed to create new list");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

// Get all lists a user is a part of (created or added as a collaborator)
app.get('/api/list' , passport.authenticate('jwt', { session: false }), function (req, res) {
  db.collection(LISTS_COLLECTION)
    .find({ 
      $and: [
        {
          // Team lists are not included
          "teamID" : { "$exists" : false }
        },
        {
          $or: [
            { createdBy: req.user._id },
            { collaborators: { $in: [ `${req.user._id}` ] } },
          ]
        }
      ]
    })
    .sort({ important: -1, createdAt: 1 })
    .toArray(function (err, docs) {
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
    db.collection(LISTS_COLLECTION).findOne({ _id: ObjectID(req.params.id) }, function (err, list) {
      if (err) {
        returnError(res, err.message, "Failed to retieve list");
      } else {
        if (list) {
          if (list.collaborators && list.collaborators.length > 0) {
            db.collection(USERS_COLLECTION)
              .find({ _id: { $in: [...list.collaborators, list.createdBy].map(user => ObjectID(user)) } })
              .toArray(function (err, users) {
                const listWithUsers = { ...list };
                listWithUsers.createdBy = users.find(user => ObjectID(list.createdBy).equals(user._id) );
                listWithUsers.collaborators = list.collaborators.map(collaborator =>
                  users.find(user => ObjectID(collaborator).equals(user._id))
                );
                res.status(200).json(listWithUsers);
              });
          } else {
            res.status(200).json(list);
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

// Delete list with specific id
app.delete('/api/list/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    db.collection(LISTS_COLLECTION).deleteOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
        if (err) {
          returnError(res, err.message, "Failed to delete list");
        } else {
          if (doc.deletedCount > 0) {
            res.status(200).json({"message": "success"});
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

// Add a user to a list
app.post('/api/list/:id/collaborators/:userId', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    db.collection(LISTS_COLLECTION).updateOne({ 
      _id: ObjectID(req.params.id)},
      { $push: { collaborators: req.params.userId } },
      function (err, result) {
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

// Remove a user from a list
app.delete('/api/list/:id/collaborators/:userId', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    db.collection(LISTS_COLLECTION).updateOne({ 
      _id: ObjectID(req.params.id)},
      { $pull: { collaborators: req.params.userId } },
      function (err, result) {
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


/**
 * ******************************** TASKS ********************************
 */

var TASKS_COLLECTION = 'TASKS';

// Create task
app.post('/api/task', passport.authenticate('jwt', { session: false }), function (req, res) {
  const newTask = req.body;
  const now = new Date();
  newTask.createdAt = now;
  newTask.orderDate = now;
  newTask.createdBy = ObjectID(req.user._id);

  if (newTask.listId) {
    newTask.listId = ObjectID(newTask.listId);
  }

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
app.get('/api/task', passport.authenticate('jwt', { session: false }), function (req, res) {
  const filterParams = { 
    completed: { $in: [null, false] },
    deleted: { $in: [null, false] },
  };

  if (req.query.teamId) {
    filterParams.teamId = req.query.teamID
  } else {
    filterParams.createdBy = ObjectID(req.user._id);
  }

  if (req.query.completed === 'true') {
    filterParams.completed = true;
  }

  if (req.query.deleted === 'true') {
    filterParams.deleted = true;
  }

  if (req.query.listId && req.query.listId !== 'today' && req.query.listId !== 'me') {
    filterParams.listId = ObjectID(req.query.listId);
  }

  if (req.query.listId && req.query.listId === 'me') {
    filterParams.assignee = ObjectID(req.user._id);
  } else {
    if (req.query.teamId) {
      filterParams.teamId = req.query.teamID
    } else {
      filterParams.createdBy = ObjectID(req.user._id);
    }
  }
  
  db.collection(TASKS_COLLECTION)
    .find(filterParams)
    .sort({ important: -1, orderDate: -1 })
    .toArray(function (err, tasks) {
      if (err) {
        returnError(res, err.message, "Failed to retieve tasks");
      } else {
        const assignees = tasks.map(task => ObjectID(task.assignee)).filter(val => val);
        db.collection(USERS_COLLECTION).find({ _id: { $in: assignees } })
          .toArray((err, users) => {        
            let finalTasks = tasks.map(task => {
              task.assignee = users.find(user => ObjectID(task.assignee).equals(user._id));
              return task;
            });
                        
            const listIds = tasks.map(task => ObjectID(task.listId)).filter(val => val);
            db.collection(LISTS_COLLECTION)
              .find({ _id: { $in: listIds } })
              .project({ teamID: 1, title: 1 })
              .toArray((err, lists) => {
                const teamIds = lists.map(list => ObjectID(list.teamID)).filter(val => val);
                db.collection(TEAMS_COLLECTION)
                  .find({ _id: { $in: teamIds } })
                  .project({ name: 1 })
                  .toArray((err, teams) => {                        
                    finalLists = lists.map(list => {
                      if (list.teamID) {
                        list.team = teams.find(team => ObjectID(list.teamID).equals(team._id));
                      }
                      return list;
                    });

                    finalTasks = tasks.map(task => {
                      task.list = finalLists.find(list => ObjectID(task.listId).equals(list._id));
                      return task;
                    });         

                    res.status(200).json(finalTasks);
                  });
              });
          });
      }
    });
});

// Get task with specific id
app.get('/api/task/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
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
app.put('/api/task/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    const updatedTask = { ...req.body };

    if (req.body.orderDate) {
      updatedTask.orderDate = new Date(Date.parse(req.body.orderDate));
    }

    if (req.body.listId) {
      updatedTask.listId = ObjectID(req.body.listId);
    }

    if (req.body.assignee) {
      updatedTask.assignee = ObjectID(req.body.assignee);
    }

    db.collection(TASKS_COLLECTION).updateOne({ _id: ObjectID(req.params.id) }, { $set: updatedTask }, function (err, result) {
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

let TEAMS_COLLECTION = 'TEAMS';

// Create team
app.post('/api/team', passport.authenticate('jwt', {session: false}), function (req, res) {
    var newTeam = req.body;
    newTeam.createdAt = new Date();
    newTeam.createdBy = req.user._id;
    newTeam.leaders = [];
    newTeam.leaders.push(req.user._id);

    if(newTeam.members) {
      // Non empty team initialisation
      newTeam.members = newTeam.members.map((member) => {
        if (member.isLeader) {
          newTeam.leaders.push(ObjectID(member.user._id));
        }
        return ObjectID(member.user._id);
      });
    }

    var newList = {
      "title" : "Default List",
      "createdAt" : new Date(),
      "createdBy" : req.user._id
    };

    db.collection(TEAMS_COLLECTION).insertOne(newTeam, function (err1, doc1) {
      if (err1) {
        returnError(res, err1.message, "Failed to create new team");
      } else {
        // Team created. Now create the default list
        newList.teamID = doc1.ops[0]._id;
        db.collection(LISTS_COLLECTION).insertOne(newList, function (err2, doc2) {
          if (err2) {
            returnError(res, err2.message, "Failed to create default list for new team");
          } else {
            res.status(201).json(doc1.ops[0]);
          }
        });
      }
    });
});

// Get all teams a user is in
app.get('/api/team' , passport.authenticate('jwt', { session: false }), function (req, res) {
  db.collection(TEAMS_COLLECTION)
    .find({ $or: [ { members: req.user._id}, { createdBy: req.user._id } ] })
    .toArray(function (err, teams) {
      if (err) {
        returnError(res, err.message, "Failed to retieve teams");
      } else {
        res.status(200).json(teams);
      }
    });
});

// Get team with specific id
app.get('/api/team/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TEAMS_COLLECTION).findOne({ _id: ObjectID(req.params.id) }, function (err, team) {
      if (err) {
        returnError(res, err.message, "Failed to retieve teams");
      } else {
        if (team) {
          let teamMembers = team.members;
          let users = _.uniq(_.concat(team.createdBy, teamMembers));

          db.collection(USERS_COLLECTION)
            .find({ _id: { $in: users.map(user => ObjectID(user)) } })
            .toArray(function (err, users) {
              team.creator = {
                user: users.find(user => ObjectID(team.createdBy).equals(user._id)),
                isCreator: true,
                isLeader: true,
              };
              
              if (team.members) {
                team.members = team.members.map(memberId => ({
                  user: users.find(user => ObjectID(memberId).equals(user._id)),
                  isCreator: false,
                  isLeader: !!team.leaders.find(leader => ObjectID(memberId).equals(leader)),
                }));
              }
              res.status(200).json(team);
            });

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
    db.collection(TEAMS_COLLECTION).deleteOne({ _id: ObjectID(req.params.id) }, function (err, doc) {
      if (err) {
        returnError(res, err.message, "Failed to delete team");
      } else {
        if(doc.deletedCount > 0) {
          res.status(200).json({"message": "success"});
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
    // Only description, banner and name can be updated
    if(req.body.banner) {
      // Has banner
      var toUse = {
        "banner": req.body.banner,
        "description": req.body.description,
        "name": req.body.name
      };
    } else {
      // No banner
      var toUse = {
        "description": req.body.description,
        "name": req.body.name
      };
    }
    db.collection(TEAMS_COLLECTION).updateOne({ _id: ObjectID(req.params.id)}, { $set: toUse }, function (err, result) {
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
      db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$push :{members : ObjectID(req.body._id)}}, function(err, doc){
        if (err){
          returnError(res, err.message, "Failed to add member");
        } else{
          res.status(200).json({ "message": "success" });
        }
      });
    } else {
      db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$push :{members : ObjectID(req.user._id)}}, function(err, doc){
        if (err){
          returnError(res, err.message, "Failed to add member");
        } else{
          res.status(200).json({ "message": "success" });
        }
      });
    }
    
  } else {
    returnError(res, 'Incorrect team ID format', 'Incorrect team ID format', 404);
  }
});

// Remove the current user, or a specific member from a team
app.delete('/api/team/:id/member', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    if("_id" in req.body) {
      db.collection(TEAMS_COLLECTION)
        .updateOne(
          { _id : ObjectID(req.params.id) },
          { $pull: { members: ObjectID(req.body._id) } }, 
          (err, doc) => {
            if (err){
              returnError(res, err.message, "Failed to delete member");
            } else{
              res.status(200).json({ "message": "success" });
            }
          });
    } else {
      db.collection(TEAMS_COLLECTION).updateOne(
        { _id: ObjectID(req.params.id)},
        { $pull: { members: ObjectID(req.user._id) } },
        (err, doc) => {
          if (err){
            returnError(res, err.message, "Failed to delete member");
          } else{
            res.status(200).json({ "message": "success" });
          }
        });
    }
    
  } else {
    returnError(res, 'Incorrect team ID format', 'Incorrect team ID format', 404);
  }
});

// Add the current user, or a specific user to a team
app.put('/api/team/:id/leader/:userId', passport.authenticate('jwt', { session: false }), function(req, res){
  if (ObjectID.isValid(req.params.userId)) {
    db.collection(TEAMS_COLLECTION)
      .updateOne(
        { _id: ObjectID(req.params.id)}, 
        { $push: { leaders: ObjectID(req.params.userId) } }, 
        (err, doc) => {
          if (err){
            returnError(res, err.message, "Failed to add member");
          } else {
            res.status(200).json({ "message": "success" });
          }
        });
  } else {
    returnError(res, 'Incorrect team ID format', 'Incorrect team ID format', 404);
  }
});

// Remove the current user, or a specific member from a team
app.delete('/api/team/:id/leader/:userId', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TEAMS_COLLECTION)
      .updateOne(
        { _id: ObjectID(req.params.id) }, 
        { $pull: { leaders: ObjectID(req.params.userId) } },
        (err, doc) => {
          if (err){
            returnError(res, err.message, "Failed to delete member");
          } else{
            res.status(200).json({ "message": "success" });
          }
        });
  } else {
    returnError(res, 'Incorrect team ID format', 'Incorrect team ID format', 404);
  }
});

// Add a list to a team
app.put('/api/team/:id/list', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$push :{lists : ObjectID(req.body._id)}}, function(err, doc){
      if (err){
        returnError(res, err.message, "Failed to add list");
      } else{
        res.status(200).json({ "message": "success" });
      }
    });
  } else {
    returnError(res, 'Incorrect team ID format', 'Incorrect team ID format', 404);
  }
});

// Get all lists for a team
app.get('/api/team/:id/lists' , passport.authenticate('jwt', { session: false }), function (req, res) {
  db.collection(LISTS_COLLECTION)
    .find({ "teamID" : req.params.id })
    .sort({ important: -1, createdAt: 1 })
    .toArray(function (err, docs) {
      if (err) {
        returnError(res, err.message, "Failed to retieve lists");
      } else {
        res.status(200).json(docs);
      }
    });
});

// Remove a list from a team
app.delete('/api/team/:id/list', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$pull :{lists : ObjectID(req.body._id)}}, function(err, doc){
      if (err){
        returnError(res, err.message, "Failed to delete list");
      } else{
        res.status(200).json({ "message": "success" });
      }
    });
  } else {
    returnError(res, 'Incorrect team ID format', 'Incorrect team ID format', 404);
  }
});

// Set a team member as a leader
app.put('/api/team/:id/leader', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$push :{leaders : req.body._id}}, function(err, doc){
      if (err){
        returnError(res, err.message, "Failed to add leader");
      } else{
        res.status(200).json({ "message": "success" });
      }
    });
  } else {
    returnError(res, 'Incorrect team ID format', 'Incorrect team ID format', 404);
  }
});

// Remove leader status from a team leader
app.delete('/api/team/:id/leader', passport.authenticate('jwt', {session: false}), function(req, res){
  if (ObjectID.isValid(req.params.id)) {
    db.collection(TEAMS_COLLECTION).updateOne({_id : ObjectID(req.params.id)}, {$pull :{leaders : req.body._id}}, function(err, doc){
      if (err){
        returnError(res, err.message, "Failed to delete leader");
      } else{
        res.status(200).json({ "message": "success" });
      }
    });
  } else {
    returnError(res, 'Incorrect team ID format', 'Incorrect team ID format', 404);
  }
});

/**
 * ******************************** MESSAGES ********************************
 */

let MESSAGES_COLLECTION = 'MESSAGES';

// Create a new message
app.post('/api/messages/team/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
  var newMessage = req.body;
  newMessage.createdAt = new Date();
  newMessage.createdBy = req.user._id;
  newMessage.teamID = ObjectID(req.params.id);

  db.collection(MESSAGES_COLLECTION).insertOne(newMessage, function (err, doc) {
    if (err) {
      returnError(res, err.message, "Failed to create new message");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

// Get all messages for a team
app.get('/api/messages/team/:id', passport.authenticate('jwt', {session: false}), function (req, res) {
  db.collection(MESSAGES_COLLECTION)
    .find({ "teamID" : ObjectID(req.params.id) })
    .sort({ createdAt: -1 })
    .toArray(function (err, messages) {
      if (err) {
        returnError(res, err.message, "Failed to retieve messages");
      } else {
        const userIds = _.uniq(messages.map(message => ObjectID(message.createdBy)));
        db.collection(USERS_COLLECTION).find({ _id: { "$in": userIds } }).toArray((err, users) => {        
          let finalMessages = messages.map((message) => {
            message.createdBy = users.find(user => ObjectID(message.createdBy).equals(user._id));
            return message;
          });          
          res.status(200).json(finalMessages);
        });
      }
    });
});

// Delete a message
app.delete('/api/messages/:mid', passport.authenticate('jwt', {session: false}), function (req, res) {
  db.collection(MESSAGES_COLLECTION).deleteOne({_id : ObjectID(req.params.mid)}, function(err, doc){
    if (err){
      returnError(res, err.message, "Failed to delete message");
    } else {
      res.status(200).json({ "message": "success" });
    }
  });
});

/**
 * ************************ OTHER ************************
 */

// Catchall route to always serve angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, '/index.html'));
});
