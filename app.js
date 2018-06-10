var express 	= require("express"),
	app 		= express(),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose"),
	Snap 		= require("./models/snap"),
	seedDB 		= require("./seed");

// seedDB();

// environment vars
process.env.IP = process.env.IP || "localhost";
process.env.PORT = process.env.PORT || 3000;

// express config
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
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
app.post("/snaps", function(req, res){
	// add snap object with imgurl attribute
	Snap.create(req.body.snap, function(err, addedSnap){
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