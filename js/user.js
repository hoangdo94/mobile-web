$(document).ready(function() {
	$(window).resize(function() {
		$('.avt_edit').css({'top': 0, 'left': $('img').css('marginLeft'), 'width': $('img').width() - 6 + 'px', 'height': $('img').height() - 6 + 'px'});
		// $('.avt_edit_icon').css({'left': $('.avt_edit').width()/2 - $('.avt_edit_icon').outerWidth()/2 + 'px', 'top': $('.avt_edit').height()/2 - $('.avt_edit_icon').outerHeight()/2 + 'px'});
	})

	var user = Lockr.get('user');
	var auth = Lockr.get('authorizationHeader');
	$('#username').val(user.username);
	$('#name').val(user.name);
	$('#email').val(user.email);
	$('img').attr('src', 'http://api.ws.hoangdo.info/images/' + user.avatar);

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
  	$('.edit').click(function(){
		$('input').each(function(){
			$(this).attr('readonly', false);
		});
		$('input[type=password]').parent().parent().toggle();
		$('.save').toggle();
		$('.edit').toggle();
	});
	$('.save').click(function(){
		if ($('.form-horizontal > button').click(function(e){e.preventDefault();}).context.activeElement.validationMessage)
			return false;
		$('.loading').toggle();
		var newInfo = {
			username: $('#username').val(),
			password: $('#password').val(),
			name: $('#name').val(),
			email: $('#email').val()
		}
		updateInfo(user._id, auth, newInfo, function(res, status){
			$('.loading').toggle();
			if (status === 1){
				$('input').each(function(){
					$(this).attr('readonly', true);
				});
				$('.save').toggle();
				$('.edit').toggle();
				$('input[type=password]').parent().parent().toggle();
				$('#notify').text('Update successfully')
						.attr('color', 'green')
						.attr('font-weight', 'bold')
						.toggle();
						console.log(res);
			} else {
				$('#notify').text('Update failed')
						.css({'color': 'red', 'font-weight': 'bold'})
						.toggle();
						console.log(res);
			}
			setTimeout(function(){
				$('#notify').toggle();
			}, 3000)
		})
	});
	$('.avt_edit_icon').click(function(){
		$('#fileinput').click();
	});
	$('#fileinput').change(function() {
		var formData = new FormData();
		formData.append('file', this.files[0]);
		$('.loading').toggle();
		$.ajax({
	        url: 'http://api.ws.hoangdo.info/upload',
	        type: 'POST',
	        success: function (result) {
	        	//TO-DO   post update to server
	        	$('img').attr('src', 'http://api.ws.hoangdo.info/images/' + result.data.url);
	        	$('.loading').toggle();
	        },
	        error: function (res) {
	        	$('.loading').toggle();
	        },
	        data: formData,
	        contentType: false,
	        processData: false,
	        dataType: 'json',
	        mimeType: "multipart/form-data",
	    });
	})
	$('img').load(function () {
		$('.avt_edit').css({'top': 0, 'left': $('img').css('marginLeft'), 'width': $('img').width() - 6 + 'px', 'height': $('img').height() - 6 + 'px'});
	})
})
	