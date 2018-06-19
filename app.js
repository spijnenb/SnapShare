var express 		= require("express"),
	app				= express(),
	mongoose 		= require("mongoose"),
	multer 			= require("multer"),			// handle multipart forms
	bodyParser		= require("body-parser"),		// handle default forms
	methodOverride 	= require("method-override"),
	octicons		= require("octicons"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	Snap 			= require("./models/snap"),
	User			= require("./models/user.js"),
	indexRoutes		= require("./routes/index"),
	snapRoutes		= require("./routes/snaps"),
	commentRoutes	= require("./routes/comments"),
	seedDB 			= require("./seed");

// seedDB();

// environment vars
process.env.IP = process.env.IP || "localhost";
process.env.PORT = process.env.PORT || 3000;

// CONFIG
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/snapshare");

// Passport config
app.use(require("express-session")({
	secret: "Never tell your secrets to anyone",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass info into every route
app.use(function(req, res, next){
	res.locals.octicons = octicons;
	res.locals.currentUser = req.user;
	next();
});

// ROUTES
app.use(indexRoutes);
app.use(snapRoutes);
app.use(commentRoutes);

app.get('*', function(res, res){
	res.send("Not found");
});

app.listen(process.env.PORT, process.env.IP, function(err){
	console.log("Server started on " + process.env.IP + ":" + process.env.PORT);
});