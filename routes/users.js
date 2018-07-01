var express 	= require("express"),
	router 		= express.Router(),
	multer 	= require("multer"),
	middleware 	= require("../middleware/index"),
	Snap 		= require("../models/snap"),
	User 		= require("../models/user");

// 	INDEX ROUTE
router.get("/users", function(req, res){
	User.find({}).sort({"snapsTotal":-1}).exec(function(err, users){
		if (err) {
			req.flash("error", "Cannot find users");
			res.redirect("back");
		} else {
			res.render("users/index", {users:users, page:"users"});
		}
	});
});

// SHOW ROUTE
router.get("/users/:userid", function(req, res) {
	User.findById(req.params.userid, function(err, user){
		if (err || !user) {
			req.flash("error", "User not found");
			res.redirect("back");
		} else {
			Snap.find({"author.id": user.id}).sort({"createdAt": -1}).limit(4).exec(function(err, snaps){
				if (err) {
					req.flash("error", err.message);
					res.redirect("back");
				} else {
					res.render("users/show", {user:user, snaps:snaps});
				}
			});
		}
	});
});

// EDIT ROUTE
router.get("/users/:userid/edit", middleware.checkProfileOwnership, function(req, res){
	User.findById(req.params.userid, function(err, user){
		if (err || !user) {
			req.flash("error", "User not found");
			res.redirect("back");
		} else {
			res.render("users/edit.ejs", {user:user});
		}
	});
});

// UPDATE ROUTE
router.put("/users/:userid", middleware.checkProfileOwnership, middleware.upload.single("avatar"), function(req, res){
	var userID = req.params.userid;
	var data = {};
	if (req.file) {
		data.avatar = '/' + req.file.path;
	}
	data.description = req.body.description;
	// find user
	User.findByIdAndUpdate(userID, data, function(err, user){
		if (err) {
			req.flash("error", err.message);
			res.redirect("back");
		} else {
			res.redirect("/users/" + userID);
		}
	});
});

// DESTROY ROUTE
router.delete("/users/:userid", middleware.checkProfileOwnership, function(req, res){
	User.findByIdAndRemove(req.params.userid, function(err, user){
		if (err || !user) {
			req.flash("error", "Cannot find user");
			res.redirect("back");
		} else {
			req.logout();
			req.flash("success", "You're account is deleted");
			res.redirect("/snaps");
		}
	});
});

module.exports = router;