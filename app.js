var express 		= require("express"),
	app				= express(),
	mongoose 		= require("mongoose"),
	multer 			= require("multer"),
	octicons		= require("octicons"),
	methodOverride 	= require("method-override"),
	Snap 			= require("./models/snap"),
	seedDB 			= require("./seed");

// seedDB();

// setup file uploads
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
})

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

// environment vars
process.env.IP = process.env.IP || "localhost";
process.env.PORT = process.env.PORT || 3000;

// CONFIG
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/snapshare");

// ROUTES
app.get("/", function(req, res){
	res.redirect("/snaps");
});

// INDEX ROUTE
app.get("/snaps", function(req, res){
	Snap.find({}, function(err, snaps){
		if (err) {
			console.log(err);
			res.send("Something went wrong :S");
		} else {
			res.render("index", {snaps:snaps});
		}
	});
});

// NEW ROUTE
app.get("/snaps/new", function(req, res){
	res.render("new");
});

// CREATE ROUTE
app.post("/snaps", upload.single('image'), function(req, res){
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
app.get("/snaps/:id", function(req, res){
	Snap.findById(req.params.id, function(err,snap){
		if (err) {
			console.log(err);
			res.redirect("back");
		} else {
			res.render("show", {snap:snap, octicons:octicons});
		}
	});
});

// DESTROY ROUTE
app.delete("/snaps/:id", function(req, res){
	Snap.findByIdAndRemove(req.params.id, function(err){
		if (err) console.log(err);
		res.redirect("/snaps");
	});
});

app.get('*', function(res, res){
	res.send("Not found");
});

app.listen(process.env.PORT, process.env.IP, function(err){
	console.log("Server started on " + process.env.IP + ":" + process.env.PORT);
});