var express 	= require("express"),
	router 		= express.Router(),
	multer 		= require("multer"),
	middleware	= require("../middleware/index"),
	Snap 		= require("../models/snap"),
	Comment		= require("../models/comment"),
	User		= require("../models/user");

// setup file uploads - todo refactor middleware
var storage = multer.diskStorage({
	destination: function(req, file, cb){
		cb(null, './uploads');
	},
	filename: function(req, file, cb){
		var filename = simpleHash();
		if (file.mimetype === "image/jpeg") {
			cb(null, filename + ".jpg");
		} else if (file.mimetype === "image/png") {
			cb(null, filename + ".png");
		}
	}
});

var upload = multer({
	storage, storage, 
	limits:{
		fileSize: 1024 * 512		// 500kb
	},
	fileFilter: fileFilter
});

function fileFilter(req, file, cb) {
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null,true);
	} else {
		cb(null, false);
	}
}

function simpleHash() {
	// todo tmp solution.. refactor with userid+timestamp
	var letters = "abcdefghijklmnopqrstuvwxyz";
	var hash = Date.now().toString(16);
	for (var i = 0; i < 4; i++) {
		var rng = Math.floor(Math.random() * hash.length + 1);
		hash += letters.charAt(rng);
	}
	return hash;
}

// INDEX ROUTE
router.get("/snaps", function(req, res){
	Snap.find({}, function(err, snaps){
		if (err) {
			res.send("Something went wrong, cannot find Snaps :S");
		} else {
			res.render("snaps/index", {snaps:snaps});
		}
	});
});

// NEW ROUTE
router.get("/snaps/new", middleware.isLoggedIn, function(req, res){
	res.render("snaps/new");
});

// CREATE ROUTE
router.post("/snaps", middleware.isLoggedIn, upload.single('image'), function(req, res){
	var savedImage = (req.file) ? '/' + req.file.path : req.body.imgurl;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var data = {
		imgurl: savedImage,
		title: req.body.title,
		author: author,
		rating: 0
	}

	if (savedImage) {
		Snap.create(data, function(err, addedSnap){
			if (err) req.flash("error", err.message);
			res.redirect("/snaps");
		});
	} else {
		req.flash("error", "Only .jpg and .png images are supported");
		res.redirect("/snaps/new");
	}	
});

// SHOW ROUTE
router.get("/snaps/:id", function(req, res){
	Snap.findById(req.params.id).populate("comments").exec(function(err,snap){
		if (err || !snap) {
			req.flash("error", "Cannot find Snap");
			res.redirect("/snaps");
		} else {
			res.render("snaps/show", {snap:snap});
		}
	});
});

// DESTROY ROUTE
router.delete("/snaps/:id", middleware.checkSnapOwnership, function(req, res){
	Snap.findByIdAndRemove(req.params.id, function(err, deletedSnap){
		if (err || !deletedSnap) {
			req.flash("error", "Cannot find Snap to delete");
		} else {
			req.flash("success", "Snap deleted");
		}
		res.redirect("/snaps");
	});
});

// Voting route
router.post("/snaps/:id",middleware.alreadyVoted, function(req, res){
	var vote = req.body.rating;
	// get snap, update value, save
	Snap.findById(req.params.id, function(err, snap){
		if (err || !snap) {
			req.flash("error", "Snap not found");
			res.redirect("back");
		} else {
			if (vote === "plus" || vote === "min") {
				if (vote === "plus") {
					snap.rating++;
				} else if (vote === "min") {
					snap.rating--;
				}
				User.findById(req.user, function(err, user){
					// find user, add snap to user's voted snaps
					if (err || !user) {
						console.log(user);
						req.flash("Something went wrong, Please try again");
						res.redirect("back");
					} else {
						user.votes.push(snap.id);
						snap.save();
						user.save();
						res.redirect("/snaps/" + req.params.id);
					}
				});
			} else {
				req.flash("error", "Something went wrong, vote not saved");
				res.redirect("back");
			}
		}
	})
});

module.exports = router;