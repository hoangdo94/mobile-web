$(document).ready(function() {
  getBooks(function(books) {
    $('#loading').hide();
    var tableBody = $('#books tbody');
    books.forEach(function(book) {
      var coverUrl = (book.cover)?('http://api.ws.hoangdo.info/images/' + book.cover):'http://api.ws.hoangdo.info/images/default.png';
      var publishYear = (!!book.publishYear)?book.publishYear:'unknown';
      var row = '<tr id="' + book._id + '">';
      // cover
      row += ('<td><img class="img-responsive" src="'+coverUrl+'"></td>');
      // title
      row += ('<td>' + book.title + '</td>');
      // author
      row += ('<td>' + book.author + '</td>');
      // publish year
      row += ('<td>' + publishYear + '</td>');
      // actions
      row += ('<td><a class="btn btn-sm btn-info">View</a><a class="btn btn-sm btn-warning">Edit</a><a class="btn btn-danger btn-sm">Delete</a></td>');

      row += '</tr>';
      tableBody.append(row);
    });

    $('#books').show().dataTable();
  });
});
