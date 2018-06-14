var mongoose = require("mongoose");
var Snap = require("./models/snap");

var data = [
	{
		title: "Cute pupper 1",
		imgurl: "https://i.pinimg.com/originals/83/a0/28/83a0280badbf01f7d60e3fe9478b4d5f.jpg"
	},
	{
		title: "Cute pupper 2",
		imgurl: "https://i1.wp.com/www.lowsodiumdogfoods.com/wp-content/uploads/2017/10/Puppy-Breathing-Fast-1-300x300.png?resize=300%2C300"
	},
	{
		title: "Cute pupper 3",
		imgurl: "http://unbelievablebulldogs.com/wp-content/uploads/2018/03/image1-300x300.jpeg"
	}
];

function seedDB() {
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

module.exports = seedDB;