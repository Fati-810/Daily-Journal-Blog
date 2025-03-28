//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
require("dotenv").config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare...";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque...";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien...";

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({})
    .then(posts => {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    })
    .catch(err => console.log(err));
});

app.get("/about", function(req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function(req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
});

app.get("/posts/:postId", function(req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId })
    .then(post => {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    })
    .catch(err => console.log(err));
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server started on port " + port);
});
