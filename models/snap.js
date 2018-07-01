var mongoose = require("mongoose");

var snapSchema = new mongoose.Schema({
	title: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	imgurl: String,
	rating: {type: Number, default: 0},
	createdAt: {type: Date, default: Date.now},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
	}]
});

module.exports = mongoose.model("Snap", snapSchema);