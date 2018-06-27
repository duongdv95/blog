var express = require("express"),
    router  = express.Router(),
    _       = require("lodash"),
    Blog    = require("../models/blog"),
    {isLoggedIn, getBreadcrumbs, seedBlog} = require("../middleware");

// INDEX ROUTE
router.get("/blog", getBreadcrumbs, function(req,res) {
    // res.redirect("/blog/page/1")
    Blog.find({}, function(err, allBlogs){
        if(err){
            console.log(err);
        } else {
            var newestFirstBlogList = _.reverse(Array.from(allBlogs));
            var pageNums = Math.ceil(allBlogs.length/10);
            res.render("blog/index", {
                                        blogs: newestFirstBlogList,
                                        pageNums: pageNums,
                                        breadcrumbs: req.breadcrumbs
                                    });
        }
    });

});

// NEW ROUTE
router.get("/blog/new", isLoggedIn, getBreadcrumbs, function(req,res){
    res.render("blog/new", {breadcrumbs: req.breadcrumbs});
});

// CREATE ROUTE
router.post("/blog", function(req,res){
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
router.get("/blog/:id", getBreadcrumbs, function(req,res){

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
router.get("/blog/:id/edit", isLoggedIn, getBreadcrumbs, function(req,res){
    Blog.findById(req.params.id, function(err, blogPost){
        if(err){
            console.log(err);
        } else {
            res.render("blog/edit", {blogPost: blogPost, breadcrumbs: req.breadcrumbs});
        }
    });
});

// UPDATE ROUTE
router.put("/blog/:id", function(req,res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedPost) {
        if(err){
            res.redirect("/blog/" + req.params.id);
        } else {
            res.redirect("/blog/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
router.delete("/blog/:id", isLoggedIn, function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err) {
      if(err){
          res.redirect("/blog"); 
      } else {
          res.redirect("/blog");
      }
  });
});

router.get("*", function(req,res) {
    res.send("Error! Page does not exist")
})


module.exports = router;
