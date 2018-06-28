var mongoose = require("mongoose"),
	Snap = require("./models/snap"),
	User = require("./models/user");

module.exports = function clearDB() {
	console.log("Clearing database");
	Snap.remove({}, function(err, snaps){
		if (err) {
			console.log(err.message);
		} else {
			console.log("Snaps removed");
		}
		User.remove({}, function(err, users){
			if (err) {
				console.log(err.message);
			} else {
				console.log("Users removed");
			}
		});
	});
}