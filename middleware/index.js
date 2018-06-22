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

module.exports = middlewareObject;