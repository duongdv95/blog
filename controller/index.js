var express = require("express"),
    router  = express.Router(),
    passport = require("passport"),
    {isLoggedIn, getBreadcrumbs, seedBlog} = require("../middleware");

router.get("/about", getBreadcrumbs, function(req,res){
    res.render("about", {breadcrumbs: req.breadcrumbs});
})

router.get("/", function(req,res){
    res.render("home");
})

router.get("/projects", getBreadcrumbs, function(req,res){
    res.render("projects", {breadcrumbs: req.breadcrumbs});
})

router.get("/contact", getBreadcrumbs, function(req,res){
    res.render("contact", {breadcrumbs: req.breadcrumbs});
})

// Login + Logout
router.get("/admin", getBreadcrumbs, function(req,res){
    res.render("admin");
})

router.post("/admin", passport.authenticate("local", 
    {
        successRedirect:"/blog",
        failureRedirect:"/admin"
    }), function(req,res){
});

router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/")
})

// ===========================================
//    Disable register route in production
// ===========================================
// router.get("/register", getBreadcrumbs, function(req,res){
//     res.render("register");
// })

// router.post("/register", function(req,res){
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

module.exports = router;