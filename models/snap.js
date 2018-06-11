var mongoose = require("mongoose");

var snapSchema = new mongoose.Schema({
	author: String,
	imgurl: String,
	imgbin: {data: Buffer, contentType: String}
});

module.exports = mongoose.model("Snap", snapSchema);