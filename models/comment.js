var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	author: String,
	text: String,
	createdAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model("Comment", commentSchema);