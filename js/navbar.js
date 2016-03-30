$(document).ready(function() {
  var user = Lockr.get('user');
  if (user) {
    $('#auth-link').hide();
    $('#navbar-username').text(user.name || user.username);
  } else {
    $('#new-book').hide();
    $('#nav-user-info').hide();
  }
  $('#sign-out').click(function() {
    // TO-DO: remember infor or not ...
    Lockr.flush();
    location.reload();
  });
});
