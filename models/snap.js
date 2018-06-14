var mongoose = require("mongoose");

var snapSchema = new mongoose.Schema({
	title: String,
	author: String,
	imgurl: String,
	rating: Number
});

module.exports = mongoose.model("Snap", snapSchema);