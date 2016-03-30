function authenticate(credentials, callback) {
  var settings = {
    "url": "http://api.ws.hoangdo.info/auth/",
    "method": "POST",
    "headers": {
      "authorization": "Basic " + btoa(credentials.username + ':' + credentials.password),
    },
  };
  $.ajax(settings).done(function(response) {
    if (response.status === 1) {
      callback(response.data);
    } else {
      callback(null);
    }
  });
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
