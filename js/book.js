$(document).ready(function() {
  var bookId = getQueryVariable('id');
  if (!bookId) {
    $('.panel').hide();
    $('.container').append('<h1 style="text-align: center">Wrong Request!</h1>');
  }
  getBook(bookId, function(book){
    console.log(book);
    var coverUrl = (book.cover) ? ('http://api.ws.hoangdo.info/images/' + book.cover) : 'http://api.ws.hoangdo.info/images/default.png';
    var publishYear = (!!book.publishYear) ? book.publishYear : 'Not provided';

    $('#cover').attr('src', coverUrl).attr('alt', book.title);
    $('#title').text(book.title);
    $('#created').text(book.createdAt);
    $('#modified').text(book.updatedAt);
    $('#author').text(book.author);
    $('#publish').text(publishYear);
    $('#genres').text(book.genres.join(', '));
    $('#review').text(book.review);

    $('#book-loading').hide();
    $('#details').show();
  });
});
