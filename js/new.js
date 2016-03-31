$(document).ready(function() {
  var file;
  $('#review').summernote({
    height: 300
  });
  $('#new-review').submit(function(e) {
    e.preventDefault();
    $('#new-review input, #new-review textarea').attr('disabled', true);
    $('.loading').show();
    var book = {
      title: $('#title').val(),
      author: $('#author').val(),
      publishYear: $('#year').val(),
      genres: $('#genres').val().split(',').map(function(g) {
        return g.trim();
      }),
      review: $('#review').summernote('code')
    };
    if (file) {
      //post file first
      var formData = new FormData();
      formData.append('file', file);
      $.ajax({
        url: 'http://api.ws.hoangdo.info/upload',
        type: 'POST',
        success: function(result) {
          var url = result.data.url;
          book.cover = url;
          addBook(book, function(result) {
            $('.loading').hide();
            if (result == 'created')
              $('.notify').text('Create Successful')
              .css('color', 'green')
              .show();
            else
              $('.notify').text('Create Failed')
              .css('color', 'red')
              .show();
            $('#new-review').find('input, textarea').val('');
            $('#new-review input, #new-review textarea').attr('disabled', false);
            $('#review').summernote('code','');
            setTimeout(function() {
              $('.notify').hide();
            }, 3000);
          });
        },
        error: function(res) {
          $('.notify').text('Create Failed')
            .css('color', 'red')
            .show();
          $('.loading').hide();
          $('#new-review').find('input, textarea').val('');
          $('#new-review input, #new-review textarea').attr('disabled', false);
          setTimeout(function() {
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
      addBook(book, function(result) {
        $('.loading').hide();
        if (result == 'created')
          $('.notify').text('Create Successful')
          .css('color', 'green')
          .show();
        else
          $('.notify').text('Create Failed')
          .css('color', 'red')
          .show();
        $('#new-review').find('input, textarea').val('');
        $('#new-review input, #new-review textarea').attr('disabled', false);
        $('#review').summernote('code','');
        setTimeout(function() {
          $('.notify').hide();
        }, 3000);

      });
    }
  });
  $('input[type=file]').change(function() {
    file = this.files[0];
  });
  $('#reset').click(function() {
    $('#new-review').find('input, textarea').val('');
  });
});
