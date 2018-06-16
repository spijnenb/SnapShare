var express 	= require("express"),
	router 		= express.Router(),
	bodyParser	= require("body-parser"),
	Snap		= require("../models/snap"),
	Comment		= require("../models/comment");

// todo refactor routes

// NEW ROUTE
router.get("/snaps/:id/comments/new", function(req, res){
	Snap.findById(req.params.id, function(err, snap){
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.render("comments/new", {snap:snap});
		}
	});
});

// CREATE ROUTE
router.post("/snaps/:id/comments", function(req, res){
	Snap.findById(req.params.id, function (err, snap){
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err);
					res.redirect("back");
				} else {
					// link comment to snap object and save
					snap.comments.push(comment);
					snap.save();
					res.redirect("/snaps/" + req.params.id);
				}
			});
		}
	});
});


module.exports = router;