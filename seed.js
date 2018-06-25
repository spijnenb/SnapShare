var mongoose = require("mongoose");
var Snap = require("./models/snap");
var User = require("./models/user");

var data = [
	{
		title: "Cute pupper 1",
		imgurl: "https://i.pinimg.com/originals/83/a0/28/83a0280badbf01f7d60e3fe9478b4d5f.jpg",
		comments: [],
		rating: 0,
		author: {
			id: "5b2e2631658ecb1d3c1e5f79",
			username: "thanos"
		}
	},
	{
		title: "Cute pupper 2",
		imgurl: "https://i1.wp.com/www.lowsodiumdogfoods.com/wp-content/uploads/2017/10/Puppy-Breathing-Fast-1-300x300.png?resize=300%2C300",
		comments: [],
		rating: 0,
		author: {
			id: "5b2e2631658ecb1d3c1e5f79",
			username: "thanos"
		}
	},
	{
		title: "Cute pupper 3",
		imgurl: "http://unbelievablebulldogs.com/wp-content/uploads/2018/03/image1-300x300.jpeg",
		comments: [],
		rating: 0,
		author: {
			id: "5b2e2631658ecb1d3c1e5f79",
			username: "thanos"
		}
	}
];

function seedDB(int) {
	console.log("Seeding started...");
	if (int === 0 || int === 1) {
		Snap.remove({}, function(err){
			console.log("removing all snaps...");
			data.forEach(function(snap){
				Snap.create(snap, function(err){
					if (err) console.log(err);
				});
			});
			console.log("new snaps added.");
		});
	}
	if (int === 1) {
		User.remove({}, function(err){
			if (err) {
				console.log(err);
			} else {
				console.log("users removed.");
			}
		});
	}
	if (int < 0 || int > 1 || typeof int === "undefined") {
		console.log("Please use 0 to reseed snaps and 1 to delete users");
	}
}


module.exports = seedDB;