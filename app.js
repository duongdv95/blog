var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    moment = require("moment");
    

// APP CONFIG
mongoose.connect("mongodb://localhost/blogApp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
moment().format();

// passes objects to all routes
app.use(function(req,res,next){
    res.locals = {
        moment:moment
    };
    return next();
});
var db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", function(){
    console.log("we're connected!");
});
// MONGOOSE/CONTROLLER CONFIG
var Schema = mongoose.Schema;
var blogSchema = new Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})

var Blog = mongoose.model("Blog", blogSchema);


app.get("/", function(req,res){
    res.render("home");
})

app.get("/about", function(req,res){
    res.render("about");
})

app.get("/projects", function(req,res){
    res.render("projects");
})

app.get("/resume", function(req,res){
    res.render("resume");
})

// ==================
//   RESTful ROUTES
// ==================

// INDEX ROUTE
app.get("/blog", function(req,res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else {
            res.render("blog/index", {blogs:allBlogs});
        }
    });
});

// NEW ROUTE
app.get("/blog/new", function(req,res){
    res.render("blog/new");
});

// CREATE ROUTE
app.post("/blog", function(req,res){
    var newBlogPost = req.body.blog;
    Blog.create(newBlogPost, function(err,blogPost){
        if(err){
            console.log(err);
        } else {
            res.redirect("/blog");
        }
    });
});

// SHOW ROUTE
app.get("/blog/:id", function(req,res){
    Blog.findById(req.params.id, function(err, blogPost){
        if(err){
            console.log(err);
        } else {
            res.render("blog/show", {blogPost: blogPost});
        }
    });
});

// EDIT ROUTE
app.get("/blog/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, blogPost){
        if(err){
            console.log(err);
        } else {
            res.render("blog/edit", {blogPost: blogPost});
        }
    });
});

// UPDATE ROUTE
app.put("/blog/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedPost) {
        if(err){
            res.redirect("/blog/" + req.params.id);
        } else {
            res.redirect("/blog/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
app.delete("/blog/:id", function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blog"); 
      } else {
          res.redirect("/blog");
      }
  });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started..")
});