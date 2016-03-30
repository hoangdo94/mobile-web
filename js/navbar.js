$(document).ready(function() {
  var user = Lockr.get('user');
  if (user) {
    $('#auth-link').hide();
    $('#navbar-username').text(user.name);
  } else {
    $('#new-book').hide();
    $('#nav-user-info').hide();
  }
});
