var express               = require("express"),
    moment                = require("moment"),
    bodyParser            = require('body-parser'),
    session               = require("express-session"),
    methodOverride        = require("method-override"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

// APP CONFIG
var app = express();
mongoose.connect("mongodb://localhost/blogApp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
moment().format();


var db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error"));
db.once("open", function(){
    console.log("we're connected!");
});
// MONGOOSE/CONTROLLER CONFIG
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
 
// change blogschema to postschema
var blogSchema = new Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var User = mongoose.model("User", userSchema);
var Blog = mongoose.model("Blog", blogSchema);

// PASSPORT CONFIGURATION
app.use(session({
    secret:"Merp",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Passes objects to all routes
app.use(function(req,res,next){
    res.locals = {
        moment: moment,
        currentUser: req.user
    };
    return next();
});

app.get("/", function(req,res){
    res.render("home");
})

app.get("/about", getBreadcrumbs, function(req,res){
    res.render("about", {breadcrumbs: req.breadcrumbs});
})

app.get("/projects", getBreadcrumbs, function(req,res){
    res.render("projects", {breadcrumbs: req.breadcrumbs});
})

app.get("/contact", getBreadcrumbs, function(req,res){
    res.render("contact", {breadcrumbs: req.breadcrumbs});
})

// Login + Logout
app.get("/admin", getBreadcrumbs, function(req,res){
    res.render("admin");
})

app.post("/admin", passport.authenticate("local", 
    {
        successRedirect:"/blog",
        failureRedirect:"/admin"
    }), function(req,res){
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/")
})
// ===========================================
//    Disable register route in production
// ===========================================
// app.get("/register", getBreadcrumbs, function(req,res){
//     res.render("register");
// })

// app.post("/register", function(req,res){
//     var newUser = new User({username: req.body.username});
//     User.register(newUser,req.body.password, function(err, user) {
//         if(err){
//             console.log(err);
//             return res.render("admin",{error: err.message});
//         }
//         passport.authenticate("local")(req, res, function(){
//             res.redirect("/");
//         });
//     });
// });

// ==================
//   RESTful ROUTES
// ==================

// INDEX ROUTE
app.get("/blog", getBreadcrumbs, function(req,res){
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else {
            res.render("blog/index", {blogs:allBlogs, breadcrumbs: req.breadcrumbs});
        }
    });
});

// NEW ROUTE
app.get("/blog/new", isLoggedIn, getBreadcrumbs, function(req,res){
    res.render("blog/new", {breadcrumbs: req.breadcrumbs});
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
app.get("/blog/:id", getBreadcrumbs, function(req,res){
    Blog.findById(req.params.id, function(err, blogPost){
        if(err || !blogPost){
            console.log(err);
            res.redirect("/blog");
        } else {
            req.breadcrumbs.forEach(function(object){
            if(object.breadcrumbName === blogPost._id.toString()) {
                object.breadcrumbName = blogPost.title;
            }
            });
            res.render("blog/show", {blogPost: blogPost, breadcrumbs: req.breadcrumbs});
        }
    });
});

// EDIT ROUTE
app.get("/blog/:id/edit", getBreadcrumbs, function(req,res){
    Blog.findById(req.params.id, function(err, blogPost){
        if(err){
            console.log(err);
        } else {
            res.render("blog/edit", {blogPost: blogPost, breadcrumbs: req.breadcrumbs});
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

app.get("*", function(req,res){
    res.send("Error! Page does not exist")
})

function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/blog");
}

function getBreadcrumbs (req, res, next){
    var rawUrl = req.originalUrl;
    var splitUrl = rawUrl.split("/");
    splitUrl.shift();
    req.breadcrumbs = splitUrl.map(function(element,i){
        return {
            breadcrumbName: element.charAt(0).toUpperCase() + element.substring(1),
            breadcrumbUrl: `/${splitUrl.slice(0, i+1).join('/')}`
        }
    });
    
    next();
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started..")
});