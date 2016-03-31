function authenticate(credentials, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/auth/",
    "method": "POST",
    "headers": {
      "authorization": "Basic " + btoa(credentials.username + ':' + credentials.password),
    },
  };
  $.ajax(settings)
    .done(function(response) {
      if (response.status === 1) {
        callback(response.data, 1);
      } else {
        callback(null, 2);
      }
    })
    .error(function(err) {
      callback(err, 2);
    });
}

function register(info, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/users/",
    "method": "POST",
    "data": JSON.stringify(info),
    "contentType": "application/json",
  };
  $.ajax(settings)
    .done(function(response) {
      if (response.status === 1)
        callback(response);
      else callback(null);
    });

}

function getUsers(callback) {

}

function getUser(userId, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/users/" + userId,
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

function updateInfo(userId, header, newInfo, callback) {
  $.ajax({
    url: "http://api.ws.hoangdo.info/users/" + userId,
    method: "PUT",
    data: JSON.stringify(newInfo),
    headers: {
      "Authorization": header,
    },
    contentType: "application/json",
    success: function(res) {
      callback(res, 1);
    },
    error: function(res) {
      callback(res, 2);
    }
  });
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
      callback(response.message);
    }
  });
}

function addBook(data, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/books/",
    "method": "POST",
    data: JSON.stringify(data),
    headers: {
      "Authorization": Lockr.get('authorizationHeader'),
    },
    contentType: "application/json"
  };
  $.ajax(settings).done(function(response) {
    callback(response.message);
  }, function(error) {
    callback(error.message);
  });
}

function updateBook(data, bookId, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/books/" + bookId,
    "method": "PUT",
    data: JSON.stringify(data),
    headers: {
      "Authorization": Lockr.get('authorizationHeader'),
    },
    contentType: "application/json"
  };
  $.ajax(settings).done(function(response) {
    callback(response.message);
  }, function(error) {
    callback(error.message);
  });
}

function deleteBook(bookId, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/books/" + bookId,
    "method": "DELETE",
    headers: {
      "Authorization": Lockr.get('authorizationHeader'),
    }
  };
  $.ajax(settings).done(function(response) {
    callback(response.message);
  }, function(error) {
    callback(error.message);
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

function isSignedIn() {
  var user = Lockr.get('user');
  return (!!user);
}
