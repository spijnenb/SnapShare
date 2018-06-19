var express 	= require("express"),
	router 		= express.Router(),
	passport	= require("passport"),
	User		= require("../models/user");

router.get("/", function(req, res){
	res.redirect("/snaps");
});

// User signup

router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if (err) {
			console.log(err);
			res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, function() {
				res.redirect("/snaps");
			});
		}
	});
});

// user login

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/snaps",
	failureRedirect: "/login"
}),function(req, res){});

router.get("/logout", function(req, res){
	req.logOut();
	res.redirect("/snaps");
});

module.exports = router;