// variables.js

function toggleImgViewStatus (isEnable) {
	if (isEnable) {
		serveWebCommImgStatus();
	} else {
		hideImgCommStatus();
	}
}

function persistWebCommImgStatusOnSuccess () {
	hideImgCommStatus ();
	
	// delete _imgCommTooltips['webCommTooltips'];
	_imgCommTooltips['webCommTooltips'] = [];
	var status = _imgCommTooltips['webCommStatus'];
	var store, text;
	$('img').each(function() {
		store = status[$(this).attr('src')];
		if(store){
			text = (store.length + 1) + getLocalString('tooltip_comments') ;
			$(this).wrap("<div class='wrap-web-comm-img'></div>");
			$(this).after("<span class='web-comm-img-status'>" + text + "</span>")

			var tips = $(this).tooltipster({
				content: $("<span><a href='show_comments'></a></span>").children().text(text),
				// content: text,
				autoClose: false,
				multiple: true,
				interactive: true,
				trigger: 'custom',
				position: 'bottom-left',
				functionReady: onTooltipeReadyShowComm
			});

			// tips[0].show();
			
			_imgCommTooltips['webCommTooltips'].push(tips[0]);
		}
	});

}

function onTooltipeReadyShowComm (origin, tooltip) {
	onTooltipeReady (origin, tooltip);
}

function hideImgCommStatus () {
	var tips = _imgCommTooltips['webCommTooltips'];
	for(i in tips) {
		tips[i].hide();
	}

	$('div.wrap-web-comm-img img').each(function() {
			$(this).unwrap().next().remove();
	});
}

function showImgCommStatus () {
	var tips = _imgCommTooltips['webCommTooltips'];
	for(i in tips) {
		tips[i].show();
	}
}

function serveWebCommImgStatus () {
	// console.log(_imgHashIdList);
	$.get(_serverURL + 'getAllImgStatus', {data: {imgHashIdList: _imgHashIdList}} , onSuccessImageStatus).fail(onFailImageStatus);
}

function onSuccessImageStatus (data, status, jqXHR) {
	console.log('Status has been updated successfull!');
	var results = JSON.parse(jqXHR.responseText);
	updateImgCommStatus (results.result);
	persistWebCommImgStatusOnSuccess();
	showImgCommStatus();
}

function onFailImageStatus (data, status, jqXHR) {
	console.log("Fail occured while updating status!");
	console.log(status);
}

function updateImgCommStatus (data) {
	delete _imgCommTooltips['webCommStatus'];
	var status = _imgCommTooltips['webCommStatus'] = {};
	$.map(data, function(obj, i) {
		obj = JSON.parse(obj);
		status[obj.imgSrc] ? status[obj.imgSrc].push(obj) : status[obj.imgSrc] = [];
	});
}