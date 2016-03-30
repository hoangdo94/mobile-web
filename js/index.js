$(document).ready(function() {
  getBooks(function(books) {
    var tableBody = $('#books tbody');
    books.forEach(function(book) {
      var coverUrl = (book.cover) ? ('http://api.ws.hoangdo.info/images/' + book.cover) : 'http://api.ws.hoangdo.info/images/default.png';
      var publishYear = (!!book.publishYear) ? book.publishYear : 'Not provided';
      var row = '<tr id="' + book._id + '">';
      // cover
      row += ('<td><img class="img-responsive" src="' + coverUrl + '"></td>');
      // title
      row += ('<td><a href="book.html?id='+book._id+'">' + book.title + '</a></td>');
      // author
      row += ('<td>' + book.author + '</td>');
      // publish year
      row += ('<td>' + publishYear + '</td>');

      row += '</tr>';
      tableBody.append(row);
    });

    $('#books-loading').hide();
    $('#books').show().dataTable();
  });
});
