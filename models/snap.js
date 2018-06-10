var mongoose = require("mongoose");

var snapSchema = new mongoose.Schema({
	author: String,
	imgurl: String
});

module.exports = mongoose.model("Snap", snapSchema);