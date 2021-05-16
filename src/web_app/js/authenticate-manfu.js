/*
		* MANFU - FPS
		* Copyright 2021 MANFU
		* Licensed under SEE_LICENSE (https://gitlab.com/alessandro.manfucci/forest-fire-prevention/-/blob/7b5d9a155ee6f789adca008263d704de8adc879d/LICENSE)
		*/
(function ($) {

	$("#inputSubmit").click(function () {
		email = $("#inputEmailAddress").val();
		pw = $("#inputPassword").val();
		console.log(pw);
		$("#errorLogin").prop('hidden', true);
		//console.log('clicked');
		$.ajax({
			url: "assets/php/check_user.php",
			type: "post",
			async: true,
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data: "&email=" + email + "&pw=" + pw
		}).done(function (data) {
			//On request received
			data = JSON.parse(data);
			console.log(data);
			if (data[0]) {
				$.cookie('user_type', data[1], { path: '/' });
				$.cookie('user', pw, { path: '/' });
				$(window).attr("location", "index.html")
			}
			else {
				setTimeout(function () {
					$("#errorLogin").prop('hidden', false);
				}, 20);

			}
		}).fail(function (data) {
			alert("01, Error fetching login response");
		});
	});

	$("#logOut").click(function () {
		logOut(true);
	});


})(jQuery)

function logOut(redirect) {
	$.ajax({
		url: "assets/php/check_user.php",
		type: "post",
		async: true,
		contentType: 'application/x-www-form-urlencoded; charset=utf-8',
		data: "&email=.&pw=."
	}).done(function (data) {
		//On request received
		data = JSON.parse(data);
		//console.log(data);
		$.removeCookie('user_type', { path: '/' });
		$.removeCookie('user', { path: '/' });
		$.removeCookie('selected_fps', { path: '/' });
		if(redirect)
			$(window).attr("location", "index.html");
	}).fail(function (data) {
		alert("02, Error fetching logout response");
	});
}