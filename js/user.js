$(document).ready(function() {
	$('.edit').click(function(){
		$('input').each(function(){
			$(this).attr('readonly', false);
		});
		$('#re-pass').toggle();
		$('.save').toggle();
		$('.edit').toggle();
	});
	$('.save').click(function(){
		$('input').each(function(){
			$(this).attr('readonly', true);
		});
		$('.save').toggle();
		$('.edit').toggle();
		$('#re-pass').toggle();
		
	});
	function change_avatar(){
		$('#fileinput').click();
	};
	function change_background() {
		$('#fileinput').click();
	};
})
	