var Snap 	= require("../models/snap"),
	Comment = require("../models/comment"),
	User 	= require("../models/user");

var middlewareObject = {};

middlewareObject.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "Please login first");
		res.redirect("/snaps");
	}
}

middlewareObject.checkSnapOwnership = function(req, res, next){
	// check login
	if (req.isAuthenticated()) {
		// get snap author id
		var snapID = req.params.id;
		Snap.findById(snapID, function(err, snap){
			if (err || !snap) {
				req.flash("error", "Snap not found");
				res.redirect("/snaps");
			} else {
				// compare to user's id
				if (snap.author.id.equals(req.user.id)) {
					next();
				} else {
					req.flash("error","You are not authorized to do that");
					res.redirect("/snaps");
				}
			}
		});
	} else {
		req.flash("error", "Please login first");
		res.redirect("/snaps");
	}	
}

middlewareObject.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		// find snap id
		Snap.findById(req.params.id, function(err, snap){
			if (err || !snap) {
				req.flash("error", "Snap not found");
				res.redirect("/snaps");
			} else {
				// find comment id
				Comment.findById(req.params.commentid, function(err, comment){
					if (err || !comment) {
						req.flash("error", "Comment not found");
						res.redirect("back");
					} else {
						// compare comment author with user's id
						if (comment.author.id.equals(req.user.id)) {
							next();
						} else {
							req.flash("error", "You are not authorized to do that");
							res.redirect("back");
						}
					}
				});
			}
		});
	} else {
		req.flash("error", "Please login first");
		res.redirect("back");
	}
}

middlewareObject.alreadyVoted = function(req, res, next){
	var goToNext = true;
	// check if user is logged in
	if (req.isAuthenticated()) {
		// get user
		User.findById(req.user._id, function(err, user){
			if (err || !user) {
				req.flash("error", "Something went wrong");
				res.redirect("back");
			} else {
				// votes array contains all snaps that the user voted on
				user.votes.forEach(function(vote){
					// cannot set headers with callback, therefore use goToNext var
					// if vote equals current snap, don't go to next
					if (vote.equals(req.params.id)) {
						
						goToNext = false;
					}
				});
				if (goToNext) {
					next();
				} else {
					req.flash("error", "You can only vote once");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "Please login first");
		res.redirect("back");
	}
}

module.exports = middlewareObject;