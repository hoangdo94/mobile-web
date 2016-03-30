function authenticate(credentials, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/auth/",
    "method": "POST",
    "headers": {
      "authorization": "Basic " + btoa(credentials.username + ':' + credentials.password),
    },
  };
  $.ajax(settings)
      .done(function (response) {
        if (response.status === 1) {
          callback(response.data, 1);
        } else {
          callback(null, 2);
        }
      })
      .error(function (err) {
        callback(err, 2);
      });
}

function register(info, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/users/",
    "method": "POST",
    "data": JSON.stringify(info),
    "contentType": "application/json",
  }
  $.ajax(settings)
      .done(function (response) {
        if (response.status === 1)
          callback(response);
        else callback(null);
      })
      
}

function getUsers(callback) {

}

function getUser(userId, callback) {

}

function updateInfo(userId, newInfo, callback) {

}

function getBooks(callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/books/",
    "method": "GET",
  };
  $.ajax(settings).done(function(response) {
    if (response.status === 1) {
      callback(response.data);
    } else {
      callback(null);
    }
  });
}

function getBook(bookId, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/books/" + bookId,
    "method": "GET",
  };
  $.ajax(settings).done(function(response) {
    if (response.status === 1) {
      callback(response.data);
    } else {
      callback(null);
    }
  });
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    return null;
}
