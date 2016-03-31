$(document).ready(function() {
  var bookId = getQueryVariable('id');
  if (!bookId) {
    $('.panel').hide();
    $('.container').append('<h1 style="text-align: center">Wrong Request!</h1>');
  }

  // Fetch data
  getBook(bookId, function(book){
    console.log(book);
    var coverUrl = (book.cover) ? ('http://api.ws.hoangdo.info/images/' + book.cover) : 'http://api.ws.hoangdo.info/images/default.png';
    var publishYear = (!!book.publishYear) ? book.publishYear : 'Not provided';
    var genres = (book.genres.length > 0) ? book.genres.join(', ') : 'Not provided';

    $('#cover').attr('src', coverUrl).attr('alt', book.title);
    $('#title').text(book.title);
    $('#created').text((new Date(book.createdAt)).toLocaleString());
    $('#modified').text((new Date(book.updatedAt)).toLocaleString());
    $('#author').text(book.author);
    $('#publish').text(publishYear);
    $('#genres').text(genres);
    $('#review').html(book.review);

    getUser(book.userId, function(user) {
      $('#user').text(user.name || user.username);
    });

    // Show edit/delete button for admin/owner
    var currentUser = Lockr.get('user');
    if (currentUser && (currentUser.admin || currentUser._id === book.userId)) {
      $('#tools').show();
    }

    $('#book-loading').hide();
    $('#details').show();
  });

  // Events
  $('#delete-book').click(function() {
    if (confirm('Are you sure? You will not be able to recover this book.')) {
      deleteBook(bookId, function(result) {
        alert(result.toUpperCase());
      });
    }
  });
});
