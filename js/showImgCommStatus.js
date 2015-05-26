function toggleImgViewStatus (isEnable) {
	if (isEnable) {
		$('img').wrap("<div class='wrap-web-comm-img'></div>");
		$('img').after("<span class='web-comm-img-status'>Text</span>");
	} else {
		if($('img').parent().is(".wrap-web-comm-img")) {
			$('img').unwrap();
			$('img').next().remove();
		} 
	}
}

function init (argument) {
	// body...
}