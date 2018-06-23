var Snap = require("../models/snap");
var Comment = require("../models/comment");

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

module.exports = middlewareObject;