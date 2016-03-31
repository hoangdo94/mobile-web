$(document).ready(function() {
	var file;
	$('#new-review').submit(function(e){
		e.preventDefault();
		$('.loading').show();
		var book = {
			title: $('#title').val(),
			author: $('#author').val(),
			year: $('#year').val(),
			genres: $('#genres').val(),
			review: $('#review').val()
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
		        	addBook(book, function(result){
		        		$('.loading').hide();
		        		if (result == 'created')
		        			$('.notify').text('Create Successful')
		        					.css('color', 'green')
		        					.show();
		        		else 
		        			$('.notify').text('Create Failed')
		        					.css('color', 'red')
		        					.show();
		        		$('#new-review')[0].reset();
		        		setTimeout(function(){
							$('.notify').hide();
						}, 3000);
		        	})
		        },
		        error: function (res) {
		        	$('.notify').text('Create Failed')
	        					.css('color', 'red')
	        					.show();
	        		$('.loading').hide();
	        		$('#new-review')[0].reset();
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
			addBook(book, function(result){
				$('.loading').hide();
				console.log($('.loading'));
        		if (result == 'created')
        			$('.notify').text('Create Successful')
        					.css('color', 'green')
        					.show();
        		else 
        			$('.notify').text('Create Failed')
        					.css('color', 'red')
        					.show();
        		$('#new-review')[0].reset();
        		setTimeout(function(){
					$('.notify').hide();
				}, 3000);
        		
        	})
		}
	});
	$('input[type=file]').change(function (){
		file = this.files[0];
	});
	$('#reset').click(function(){
		$('#new-review')[0].reset();
	})
})