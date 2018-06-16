var mongoose = require("mongoose");

var snapSchema = new mongoose.Schema({
	title: String,
	author: String,
	imgurl: String,
	rating: Number,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
	}]
});

module.exports = mongoose.model("Snap", snapSchema);