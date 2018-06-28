var express 	= require("express"),
	router 		= express.Router(),
	passport	= require("passport"),
	middleware 	= require("../middleware/index"),
	User		= require("../models/user");

router.get("/", function(req, res){
	res.redirect("/snaps");
});

// User signup
router.get("/register", function(req, res){
	res.render("register", {page:"register"});
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username, votes: []});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			req.flash("error", err.message);
			res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, function() {
				req.flash("success", "Welcome " + req.user.username + ". Thank you for joining SnapShare.");
				res.redirect("/snaps");
			});
		}
	});
});

// user login
router.get("/login", function(req, res){
	res.render("login", {page:"login"});
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/snaps",
	failureRedirect: "/login",
	failureFlash: true
}),function(req, res){});

router.get("/logout", function(req, res){
	req.logOut();
	req.flash("success", "You are logged out");
	res.redirect("/snaps");
});

module.exports = router;