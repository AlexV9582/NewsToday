// Dependencies
var express    = require("express");
var bodyParser = require("body-parser");
var mongoose   = require("mongoose");
// Requiring models
var Note       = require("./models/comments.js");
var Article    = require("./models/articles.js");
var Users      = require("./models/users.js")
// Scraping tools
var request    = require("request");
var cheerio    = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use body parser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/NewsToday");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the theonion website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.theonion.com/section/politics/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every div within a div within an article tag, and do the following:
    $("article").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text, description and href of every link, and save them as properties of the result object
      result.title = $(this).children("header").children("h1").children("a").text();
      result.link = $(this).children("header").children("h1").children("a").attr("href");
      result.description = $(this).children("div").children("div").text();

      // Using Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
          console.log("Scrape Complete")
        }
      });

    });
  });
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or redirect to the homepage
    else {
      res.redirect("/");
    }
  });
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// app.post("/users", function(req, res) {
//   var info = new Users(res);
//     // Now, save that entry to the db
//     info.save(function(err, doc) {
//       // Log any errors
//       if (err) {
//         console.log(err);
//       }
//       // Or log the doc
//       else {
//         console.log(doc);
//         console.log("User Added to DB")
//       }
//     });
// })

// This will get the users from the mongoDB
app.post("/users", function(req, res) {
  // Grab user info from the Users array
  Users.find({ user: req.body.user, password: req.body.password }, function(error, user) {
    if (error) {
      console.log(error);
    }
    // Or send the user to the browser as a json object
    else {
      if (!user.length) { //when no match is found
        var info = new Users(req.body);
            // Now, save that entry to the db
            info.save(function(err, doc) {
              // Log any errors
              if (err) {
                console.log(err);
              }
              // Or log the doc
              else {
                
                console.log("User Added to DB");
                res.send("User not found, but added.")
              }
            });
        
      }else {
        res.send("User was found")
      }
    }
  })
})

// This will get the comments from the mongoDB
app.get("/comments", function(req, res) {
  // Grab user info from the Comments array
  Comments.find({}, function(error, comments) {
    if (error) {
      console.log(error)
    }
    // Or send the comments to the browser as a json object
    else {
      res.json(comments);
    }
  })
})

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

