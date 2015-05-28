// variables.js

function toggleImgViewStatus (isEnable) {
	if (isEnable) {
		showWebCommImgStatus();
	} else {
		hideImgCommStatus();
	}
}

function showWebCommImgStatusOnSuccess () {
	hideImgCommStatus ();

	var store, text;
	$('img').each(function() {
		store = _jqWebCommImgPopup.data($(this).attr('src'));
		if(store){
			text = (store.length + 1) + " comments" ;
			$(this).wrap("<div class='wrap-web-comm-img'></div>");
			$(this).after("<span class='web-comm-img-status'>" + text + "</span>")
		}
	});
}

function hideImgCommStatus () {
	$('div.wrap-web-comm-img img').each(function() {
			$(this).unwrap().next().remove();
	});
}

function showWebCommImgStatus () {
	if(!_imgSrcs){
		_imgSrcs = [];
		$('img').each(function() {
			_imgSrcs.push($(this).attr('src'));
		});
	}

	$.get(_serverURL + 'getAllImgStatus', {imgSrcs: _imgSrcs} , onSuccessImageStatus).fail(onFailImageStatus);
}

function onSuccessImageStatus (data, status, jqXHR) {
	console.log('Status has been updated successfull!');
	var results = JSON.parse(jqXHR.responseText);
	updateImgCommStatus (results);
	showWebCommImgStatusOnSuccess();
}

function onFailImageStatus (data, status, jqXHR) {
	console.log("Fail occure while updating status!");
	console.log(status);
}

function updateImgCommStatus (data) {
	_jqWebCommImgPopup.removeData();
	$.map(data, function(obj, i) {
		_jqWebCommImgPopup.data(obj.imgSrc)
			? _jqWebCommImgPopup.data(obj.imgSrc).push(obj)
				: _jqWebCommImgPopup.data(obj.imgSrc, []);
	});
}