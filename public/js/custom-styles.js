$(document).ready(function(){
	// nav underline style
	setTimeout(function(){
		var el = document.querySelector("#underlined");
		if (el) {
			el.style.width = "100%";
		}
	},100);

	// prompt message deleting profile
	$("#delete").on('click', function(){
		var msg = prompt("Are you sure you want to delete your profile and your account?\nType DELETE to confirm");
		if (msg != "DELETE") {
			return false;
		}
	});
});



