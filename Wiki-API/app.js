//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
}); //, {userNewUrlParser: true}

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema)

/////////////////// Request targetting Articles//////////////////////////

app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully delete all documents.");
      } else {
        res.send(err);
      }
    });
  });

/////////////////// Request targetting specific Article//////////////////////////
app.route("/articles/:articleTitle")

  .get(function(req, res) {
    Article.findOne({
      title: req.params.articleTitle
    }, function(err, foundArticle) {
      if (!err) {
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.");
      }
    });
  })

  .put(function(req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        title: req.body.title,
        content: req.body.content
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })

  .patch(function(req, res) {
    Article.updateOne({
        title: req.params.articleTitle
      }, {
        $set: {
          // title: req.body.title,
          content: req.body.content
        }
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated the selected article.");
        }
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne({title: req.params.articleTitle},
      function(err) {
        if (!err) {
          res.send("Successfully delete document.");
        } else {
          res.send(err);
        }
      });
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
