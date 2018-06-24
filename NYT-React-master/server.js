// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

var Article = require("./models/model");

var app = express();
var PORT = process.env.PORT || 3000;

// Run Morgan 
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));
app.use(express.static("./public"));

// MongoDB connection
var db = mongoose.connection;
mongoose.connect("mongodb://heroku_p5s453s6:1ip41l2a1vf73e76pijoeh5uda@ds113650.mlab.com:13650/heroku_p5s453s6")

db.on("error", function(err) {
  console.log("Mongoose Error: ", err);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});




// Route to get all saved articles
app.get("/api/saved", function(req, res) {
  Article.find({})
    .exec(function(err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        res.send(doc);
      }
    });
});

// add an article to saved list
app.post("/api/saved", function(req, res) {
  var newArticle = new Article(req.body);
  console.log(req.body);
  newArticle.save(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      res.send(doc);
    }
  });
});

// Route to delete an article from saved list
app.delete("/api/saved/", function(req, res) {
  var url = req.param("url");
  Article.find({ url: url }).remove().exec(function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.send("Deleted");
    }
  });
});

// Any non API GET routes will be directed to our React App and handled by React Router
app.get("*", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});


app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});