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


// Routes
// ======

// A GET request to scrape the theonion website
app.get("/articles", function(req, res) {
  // First, we grab the body of the html with request
  request("http://http://www.theonion.com/section/politics/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within a header tag, and do the following:
    $("header h2").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").attr("title");
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
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
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
