var Blog = require("../models/blog");
var middleware = {};

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/blog");
}

middleware.getBreadcrumbs = function(req, res, next){
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

middleware.seedBlog = function() {
    let seedPost = {
        title: "seedpost",
        body: "Spicy jalapeno bacon ipsum dolor amet prosciutto burgdoggen pork chop, ribeye salami kevin sausage bacon chicken frankfurter landjaeger swine tri-tip alcatra shank. Cupim chicken pork meatball, ribeye tenderloin frankfurter biltong porchetta filet mignon short loin tri-tip sirloin corned beef. Rump hamburger ribeye brisket tenderloin flank, cupim pig beef tongue capicola beef ribs burgdoggen. Beef ribs picanha pig corned beef hamburger tenderloin pancetta pork tail short ribs bacon leberkas short loin."
    }
    Blog.create(seedPost, function(err,blogPost){
        if(err){
            console.log(err);
        }
    });
}

module.exports = middleware;