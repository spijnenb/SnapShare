var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
	username: String,
	password: String,
	votes: [{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Snap"
	}],
	avatar: String,
	description: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);