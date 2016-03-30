$(document).ready(function() {
	$('a').click(function() {
		$('.container > div:first-child').toggle();
		$('.container > div:nth-child(2)').toggle();
	})
	$('form').submit(function(e) {
		e.preventDefault();
		var info;
		if ($(this).children().length > 7){
			if ($('#registerPassword').val() != $('#repass').val()){
				$('.notify').text('* Password and re-password do not match!');
				return false;
			}
				
			info = {
				username: $('#registerUsername').val(),
				password: $('#registerPassword').val(),
				email: $('#registerEmail').val()
			}
			register(info, function(result) {
				console.log(result);
				if (!result) {
					$('#register .notify').text('* Failed!');
				} else {
					$('#register form')[0].reset();
					$('#register .notify').text('');
					$('#login .notify').attr('class', 'success').text('Sign up successful! Enter username and password again to sign in.')
					$('.container > div:first-child').toggle();
					$('.container > div:nth-child(2)').toggle();
				}
			})
		}
		else {
			info = {
				username: $('username').val(),
				password: $('password').val()
			}
			authenticate(info, function(user) {
				if (user) {
					//set local storage
					Lockr.set('id', user._id);
					window.location.href = window.location.pathname + replace("auth.html", "index.html");
				} else {
					$('#login .notify').text('* Failed!');
				}
			})
		}
	})
})