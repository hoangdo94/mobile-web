$(document).ready(function() {
	if (!isSignedIn()) {
		// redirect to homepage
		window.location.href = window.location.pathname.replace("user.html", "index.html");
	}

  $(window).resize(function() {
    $('.avt_edit').css({
      'top': 0,
      'left': $('img').css('marginLeft'),
      'width': $('img').width() - 6 + 'px',
      'height': $('img').height() - 6 + 'px'
    });
    // $('.avt_edit_icon').css({'left': $('.avt_edit').width()/2 - $('.avt_edit_icon').outerWidth()/2 + 'px', 'top': $('.avt_edit').height()/2 - $('.avt_edit_icon').outerHeight()/2 + 'px'});
  });

  var user = Lockr.get('user');
  var auth = Lockr.get('authorizationHeader');

  function updateContent(newUser) {
    $('#username').val(newUser.username);
    $('#name').val(newUser.name);
    $('#email').val(newUser.email);
    $('img').attr('src', 'http://api.ws.hoangdo.info/images/' + newUser.avatar).attr('alt', 'Avatar');
  }

  updateContent(user);
  //handle map
  var view = new ol.View({
    center: ol.proj.fromLonLat([106.65861679999999, 10.7642177]),
    zoom: 12
  });

  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map',
    controls: ol.control.defaults({
      attributionOptions: ({
        collapsible: false
      })
    }),
    view: view
  });

  var geolocation = new ol.Geolocation({
    projection: view.getProjection()
  });

  $('#track').change(function() {
    geolocation.setTracking(this.checked);
  });

  geolocation.on('error', function(error) {
    $('#info').text(error.message)
      .css('display', '');
    setTimeout(function() {
      $('#info').text('');
    }, 3000);
  });

  var accuracyFeature = new ol.Feature();
  geolocation.on('change:accuracyGeometry', function() {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
  });

  var positionFeature = new ol.Feature();
  positionFeature.setStyle(new ol.style.Style({
    image: new ol.style.Circle({
      radius: 6,
      fill: new ol.style.Fill({
        color: '#3399CC'
      }),
      stroke: new ol.style.Stroke({
        color: '#fff',
        width: 2
      })
    })
  }));

  geolocation.on('change:position', function() {
    var coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ?
      new ol.geom.Point(coordinates) : null);
  });

  new ol.layer.Vector({
    map: map,
    source: new ol.source.Vector({
      features: [accuracyFeature, positionFeature]
    })
  });

  //event
  $('#edit').click(function() {
    $('#myModalNorm').modal('show');
    $('#upUsername').val($('#username').val());
    $('#upName').val($('#name').val());
    $('#upEmail').val($('#email').val());
  });
  $('#updateForm').submit(function(e) {
    e.preventDefault();
    if ($('#upPassword').val() != $('#upRe-password').val()) {
      $('.notify').text('Password and Re-pass do not match!')
        .toggle();
      setTimeout(function() {
        $('.notify').toggle();
      }, 3000);
      return false;
    }
    if (!$('#upPassword').val()) {
      $('.notify').text('You did not enter password or re-password yet!')
        .toggle();
      setTimeout(function() {
        $('.notify').toggle();
      }, 3000);
      return false;
    }
    $('.loading').toggle();
    var newInfo = {
      username: $('#upUsername').val(),
      password: $('#upPassword').val(),
      name: $('#upName').val(),
      email: $('#upEmail').val()
    };
    updateInfo(user._id, auth, newInfo, function(res, status) {
      $('.loading').toggle();
      if (status === 1) {
        user.username = newInfo.username;
        user.name = newInfo.name;
        user.email = newInfo.email;
        Lockr.set('user', user);
        Lockr.set('authorizationHeader', "Basic " + btoa(newInfo.username + ":" + newInfo.password));
        $('#myModalNorm').modal('hide');
        $('#notify').text('Update successful')
          .css({
            'color': 'green',
            'font-weight': 'bold'
          })
          .toggle();
        updateContent(user);
        location.reload();
      } else {
        $('#myModalNorm').modal('hide');
        $('#notify').text('Update failed')
          .css({
            'color': 'red',
            'font-weight': 'bold'
          })
          .toggle();
      }
      setTimeout(function() {
        $('#notify').toggle();
      }, 3000);
    });
  });

  $('.avt_edit_icon').click(function() {
    $('#fileinput').click();
  });
  $('#fileinput').change(function() {
    var formData = new FormData();
    formData.append('file', this.files[0]);
    $('.loading').toggle();
    $.ajax({
      url: 'http://api.ws.hoangdo.info/upload',
      type: 'POST',
      success: function(result) {
        var url = result.data.url;
        updateInfo(user._id, auth, {
          avatar: url
        }, function(result) {
          user.avatar = url;
          if (result.status == 1) {
            Lockr.set('user', user);
          } else {
            $('#notify').text('Failed')
              .css({
                'color': 'red',
                'font-weight': 'bold'
              })
              .toggle();
            setTimeout(function() {
              $('#notify').toggle();
            }, 3000);
          }
        });
        $('img').attr('src', 'http://api.ws.hoangdo.info/images/' + result.data.url);
        $('.loading').toggle();
      },
      error: function(res) {
        $('.loading').toggle();
      },
      data: formData,
      contentType: false,
      processData: false,
      dataType: 'json',
      mimeType: "multipart/form-data",
    });
  });
  $('img').load(function() {
    $('.avt_edit').css({
      'top': 4,
      'left': $('img').css('marginLeft') + 4,
      'width': $('img').width() - 6 + 'px',
      'height': $('img').height() - 6 + 'px'
    });
  });
});
