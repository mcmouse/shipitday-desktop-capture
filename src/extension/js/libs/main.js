$(function(){
	// $('.modal-trigger').leanModal();
	var $mic = $('.mic');
	$micIcon = $('.mic i');
	$mic.click(function() {
		if($mic.hasClass('active')) {
			$mic.removeClass('red active').addClass('green');
			$micIcon.removeClass('md-av-mic').addClass('md-as-mic-off');
		}

		else {
			$mic.addClass('active red').removeClass('green');
			$micIcon.removeClass('md-av-mic-off').addClass('md-as-mic');
		}
	});
});