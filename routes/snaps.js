var express 	= require("express"),
	router 		= express.Router(),
	octicons	= require("octicons"),
	multer 		= require("multer"),
	Snap 		= require("../models/snap"),
	Comment		= require("../models/comment");

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
			console.log(err);
			res.send("Something went wrong :S");
		} else {
			res.render("snaps/index", {snaps:snaps});
		}
	});
});

// NEW ROUTE
router.get("/snaps/new", function(req, res){
	res.render("snaps/new");
});

// CREATE ROUTE
router.post("/snaps", upload.single('image'), function(req, res){
	var savedImage = (req.file) ? '/' + req.file.path : req.body.imgurl;
	if (savedImage) {
		Snap.create({imgurl:savedImage, title:req.body.title}, function(err, addedSnap){
			if (err) console.log(err);
			res.redirect("/snaps");
		});
	} else {
		res.send("Only .jpg and .png images are supported");	// todo add error handling
	}	
});

// SHOW ROUTE
router.get("/snaps/:id", function(req, res){
	Snap.findById(req.params.id).populate("comments").exec(function(err,snap){
		if (err) {
			console.log("Snap not found",err);
			res.redirect("back");
		} else {
			res.render("snaps/show", {snap:snap, octicons:octicons});
		}
	});
});

// DESTROY ROUTE
router.delete("/snaps/:id", function(req, res){
	Snap.findByIdAndRemove(req.params.id, function(err){
		if (err) console.log(err);
		res.redirect("/snaps");
	});
});

module.exports = router;