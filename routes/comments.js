var express 	= require("express"),
	router 		= express.Router(),
	bodyParser	= require("body-parser"),
	middleware	= require("../middleware/index"),
	Snap		= require("../models/snap"),
	Comment		= require("../models/comment");

// NEW ROUTE
router.get("/snaps/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Snap.findById(req.params.id, function(err, snap){
		if (err || !snap) {
			req.flash("error", "Cannot find Snap");
			res.redirect("/snaps");
		} else {
			res.render("comments/new", {snap:snap});
		}
	});
});

// CREATE ROUTE
router.post("/snaps/:id/comments", middleware.isLoggedIn, function(req, res){
	var newComment = Comment({
		text: req.body.comment.text,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	});
	Snap.findById(req.params.id, function (err, snap){
		if (err || !snap) {
			req.flash("error", "Cannot find Snap");
			res.redirect("/snaps");
		} else {
			Comment.create(newComment, function(err, comment){
				if (err) {
					req.flash("error", "Comment not saved");
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

// EDIT ROUTE
router.get("/snaps/:id/comments/:commentid/edit", middleware.checkCommentOwnership, function(req, res){
	var snapID = req.params.id;
	Snap.findById(snapID, function(err, snap){
		if (err || !snap) {
			req.flash("error", "Cannot find Snap");
			res.redirect("/snaps");
		} else {
			Comment.findById(req.params.commentid, function(err, comment){
				if (err || !comment) {
					req.flash("error", "Cannot find comment");
					res.redirect("/snaps/" + req.params.id);
				} else {
					res.render("comments/edit", {comment:comment, snapID});
				}
			});
		}
	});
});

// UPDATE ROUTE
router.put("/snaps/:id/comments/:commentid", middleware.checkCommentOwnership ,function(req, res){
	var commentID = req.params.commentid;
	var data = req.body.comment;
	Comment.findByIdAndUpdate(commentID, data, function(err, comment){
		if (err || !comment) {
			req.flash("error", "Something went wrong, edit is not saved");
		}
		res.redirect("/snaps/" + req.params.id);
	});
});

// DESTROY ROUTE
router.delete("/snaps/:id/comments/:commentid", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.commentid, function(err, comment){
		if (err || !comment) {
			req.flash("error", "Comment not deleted");
		}
		res.redirect("/snaps/" + req.params.id);
	});
});


module.exports = router;