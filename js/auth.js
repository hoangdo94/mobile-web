$(document).ready(function() {
  $('.form-signin > div > a').click(function() {
    $('.container > div:first-child').toggle();
    $('.container > div:nth-child(2)').toggle();
    $(this).parent().parent()[0].reset();
  });

  $('#register').submit(function(e) {
    e.preventDefault();
    if ($('#registerPassword').val() != $('#repass').val()) {
      $('.notify').text('* Password and re-password do not match!');
      return false;
    }
    if ($('#registerUsername').val().length < 3 || $('#registerUsername').val().length > 16) {
      $('.notify').text('* Username\'s length at least 3 characters and maximum length of 16!');
      return false;
    }
    $('.loading').toggle();
    var info = {
      username: $('#registerUsername').val(),
      password: $('#registerPassword').val(),
      email: $('#registerEmail').val()
    };
    register(info, function(result) {
      if (!result) {
        $('#register .notify').text('* Username or Email has existed!');
      } else {
        $('#register')[0].reset();
        $('#register .notify').text('');
        $('#login .notify').attr('class', 'success').text('Sign up successful! Enter username and password again to sign in.');
        $('.container > div:first-child').toggle();
        $('.container > div:nth-child(2)').toggle();
      }
      $('.loading').toggle();
    });
  });

  $('#login').submit(function(e) {
    e.preventDefault();
    $('.loading').toggle();
    var info = {
      username: $('#inputUsername').val(),
      password: $('#inputPassword').val()
    };
    authenticate(info, function(user, status) {
      if (user && status == 1) {
        //set local storage
        Lockr.set('user', user);
        Lockr.set('authorizationHeader', 'Basic ' + btoa(info.username + ':' + info.password));
        window.location.href = window.location.pathname.replace("auth.html", "index.html");
      } else {
        $('#login .notify').text('* User not found!');
      }
      $('.loading').toggle();
    });
  });
});
