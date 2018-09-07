var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var app = express();
var router = express.Router();
app.use(bodyParser.json());

// Create link to Angular build directory
var distDir = __dirname + "/dist/";
app.use(express.static(distDir));
app.use('/api', router);

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

//Basic authentication
router.post('/auth', function(req, res) {
    if(req.body.email && req.body.password){   //Field Check
        db.collection('users').findOne({email: req.body.email}, function (err, result) {
            if (result) {
                //console.log("Email Found");
                if(req.body.password == result.password){
                    res.status(200).json({success: true});
                } else res.json({success: false});
            }
            else {
                //console.log("Email Not Found");
                res.status(200).json({success: false});
            }
        });
    } else res.status(400).json({success: false}); //Bad request, incomplete field
});
