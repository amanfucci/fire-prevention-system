(function ($) {

	$("#inputSubmit").click(function() {
		email = $("#inputEmailAddress").val();
		pw = $("#inputPassword").val();
		console.log(pw);
		$("#errorLogin").prop('hidden', true);
		console.log('clicked');
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
			if (data[0]){
				$.cookie('user_type', data[1], { path: '/' });
				$.cookie('user', pw, { path: '/' });
				$(window).attr("location","index.html")
			}
			else{
				setTimeout(function(){
					$("#errorLogin").prop('hidden', false);
				},20);
				
			}
		}).fail(function (data) {
			alert("01, Error fetching login response");
		});
	});

	$("#logOut").click(function() {
		$.ajax({
			url: "assets/php/check_user.php",
			type: "post",
			async: true,
			contentType: 'application/x-www-form-urlencoded; charset=utf-8',
			data: "&email=.&pw=."
		}).done(function (data) {
			//On request received
			data = JSON.parse(data);
			console.log(data);
			$.removeCookie('user_type',{ path: '/' });
			$.removeCookie('user',{ path: '/' });
			$(window).attr("location","index.html");
		}).fail(function (data) {
			alert("02, Error fetching logout response");
		});
	});


})(jQuery)