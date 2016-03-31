$(document).ready(function() {
  var bookId = getQueryVariable('id');
  if (!bookId) {
    $('.panel').hide();
    $('.container').append('<h1 style="text-align: center">Wrong Request!</h1>');
  }
  $('#upReview').summernote({
    height: 300
  });
  var file;
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

    $('#upTitle').val(book.title);
    $('#upAuthor').val(book.author);
    $('#upYear').val(book.publishYear);
    $('#upGenres').val(book.genres.join(', '));
    $('#upReview').summernote('code', book.review);

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
        if (result === 'deleted') {
          // redirect to homepage
          window.location.href = window.location.pathname.replace("book.html", "index.html");
        }
      });
    }
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
      genres: $('#upGenres').val().split(',').map(function(g) {
        return g.trim();
      }),
      review: $('#upReview').summernote('code')
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
              doUpdate(book);
            },
            error: function (res) {
              $('.notify').text('Cannot upload the Cover. Please try again').css('color', 'red').show();
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
      doUpdate(book);
    }
  });

  function doUpdate(book) {
    updateBook(book, bookId, function(result){
      $('.loading').hide();
      if (result == 'updated'){
        $('.notify').text('Update Successful').css('color', 'green').show();
        setTimeout(function(){
          location.reload();
        }, 500);
      } else {
        $('.notify').text('Failed to Update. Please try again.').css('color', 'red').show();
        setTimeout(function(){
          $('.notify').hide();
        }, 3000);
      }
      $('#updateForm input, #updateForm textarea').attr('disabled', false);

    });
  }
});
