var express               = require("express"),
    app                   = express(),
    _                     = require("lodash"),
    moment                = require("moment"),
    bodyParser            = require('body-parser'),
    session               = require("express-session"),
    methodOverride        = require("method-override"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User                  = require("./models/user"),
    Blog                  = require("./models/blog"),
    middleware = require("./middleware");

// =========================
//          ROUTES
// =========================
var blogRoutes            = require("./controller/blogs"),
    indexRoutes           = require("./controller/index");
    
// APP CONFIG
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
    res.locals = {moment: moment, currentUser: req.user};
    return next();
});

app.use(indexRoutes);
app.use(blogRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started..")
});