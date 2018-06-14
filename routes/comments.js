var express 	= require("express"),
	router 		= express.Router(),
	Snap		= require("../models/snap");

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


module.exports = router;