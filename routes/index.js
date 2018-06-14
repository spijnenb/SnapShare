var express = require("express"),
	router = express.Router();

router.get("/", function(req, res){
	res.redirect("/snaps");
});

module.exports = router;