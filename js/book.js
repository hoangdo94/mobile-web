$(document).ready(function() {
  var bookId = getQueryVariable('id');
  if (!bookId) {
    $('.panel').hide();
    $('.container').append('<h1 style="text-align: center">Wrong Request!</h1>');
  }
  var newBook;
  var file;
  function updateContent(book){
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
  }
  // Fetch data
  getBook(bookId, function(book){
    newBook = book
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

  $('#edit-book').click(function(){
    $('#myModalNorm').modal('show');
    $('#upTitle').val(newBook.title);
    $('#upAuthor').val(newBook.author);
    $('#upYear').val(newBook.publishYear);
    $('#genres').val((newBook.genres.length > 0) ? newBook.genres.join(', ') : '');
    $('#review').val(newBook.review);
  });

  $('input[type=file]').change(function (){
    file = this.files[0];
  });

  $('#updateForm').submit(function(e){
    e.preventDefault();
    $('#updateForm input, #updateForm textarea').attr('disabled', true);
    $('.loading').show();
    var book = {
      title: $('#upTitle').val(),
      author: $('#upAuthor').val(),
      publishYear: $('#upYear').val(),
      genres: $('#upGenres').val(),
      review: $('#upReview').val()
    };
    if (file) {
      //post file first
      var formData = new FormData();
      formData.append('file', file);
      $.ajax({
            url: 'http://api.ws.hoangdo.info/upload',
            type: 'POST',
            success: function (result) {
              var url = result.data.url;
              book.cover = url;
              updateBook(book, newBook._id, function(result){
                $('.loading').hide();
                if (result == 'updated'){
                  $('.notify').text('Update Successful')
                      .css('color', 'green')
                      .show();
                  updateContent(book);
                }
                else 
                  $('.notify').text('Update Failed')
                      .css('color', 'red')
                      .show();
                $('#updateForm input, #updateForm textarea').attr('disabled', false);
                setTimeout(function(){
                  $('.notify').hide();
                }, 3000);
              })
            },
            error: function (res) {
              $('.notify').text('Update Failed')
                    .css('color', 'red')
                    .show();
              $('.loading').hide();
              $('#updateForm input, #updateForm textarea').attr('disabled', false);
              setTimeout(function(){
                $('.notify').hide();
              }, 3000);
            },
            data: formData,
            contentType: false,
            processData: false,
            dataType: 'json',
            mimeType: "multipart/form-data",
        });
    } else {
      updateBook(book, newBook._id, function(result){
        $('.loading').hide();
            if (result == 'updated'){
              $('.notify').text('Update Successful')
                  .css('color', 'green')
                  .show();
              book.cover = newBook.cover;
              updateContent(book);
            }
            else 
              $('.notify').text('Update Failed')
                  .css('color', 'red')
                  .show();
            $('#updateForm input, #updateForm textarea').attr('disabled', false);
            setTimeout(function(){
              $('.notify').hide();
            }, 3000);
      })
    }
  })
});
