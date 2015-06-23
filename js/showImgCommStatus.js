/*
	Image comment status module.

	exports:
		toggleImgStatus(true|false)
		requestImgStatus()

	imports:
		getHashIdList()
		getServerURL()
		getTagNameImgHashId()
		clickShowPopupWebCommForm(jqObj, jqTarget)
*/

var MODULE = (function(scope) {

	var imgCommData = {};

	this.requestImgStatus = function () {
	// console.log(_imgHashIdList);
		$.get(scope.getServerURL() + 'status',
			{imgHashIdList: getHashIdList()},
			onSuccessImageStatus).
			fail(onFailImageStatus);
	}

	scope.toggleImgStatus = function(isEnable) {
		console.log('toggleImgStatus ' + isEnable);
		isEnable ? this.requestImgStatus() : hideWrappedStatus();
	}

	scope.hideImgStatus = function () {
		hideWrappedStatus();
	}

	scope.requestImgStatus = this.requestImgStatus;

	function getHashIdList () {
		return scope.getHashIdList();
	}

	function onFailImageStatus (data, status, jqXHR) {
		console.log("Fail occured while updating status!");
		console.log(status);
		updateImgStatus ([]);
	}

	function onSuccessImageStatus (data, status, jqXHR) {
		console.log('Status has been updated successfull!');
		var results = JSON.parse(jqXHR.responseText);
		updateImgStatus (results.result);
		showImgStatus();
	}

	function updateImgStatus (data) {
		console.log(data);
		$.map(data, function(obj, i) {
			obj = JSON.parse(obj);
			imgCommData[obj.hashId] = obj;
		});
	}

	function showImgStatus () {
		console.log('showImgStatus');
		hideWrappedStatus ();
		var	store;
		$('img[' + getTagNameImgHashId() + ']').each(function() {
			store = imgCommData[$(this).attr(getTagNameImgHashId())];
			if(store){
				text = store['count'] + scope.getLocalizeString('tooltip_comments') ;
				showWrappedStatus($(this), text);
			}
		});
	}


	function showWrappedStatus (jqImg, text) {
		jqImg.wrap("<div class='wrap-web-comm-img'></div>");
		jqImg.after("<span class='web-comm-img-status'>" + text + "</span>");

		getClickPopupForm(jqImg, jqImg.next('span.web-comm-img-status'));
	}

	function hideWrappedStatus () {
		$('div.wrap-web-comm-img img').each(function() {
				$(this).unwrap().next().remove();
		});
	}

	function getClickPopupForm (jqObj, jqTarget) {
		return scope.clickShowPopupWebCommForm(jqObj, jqTarget);
	}

	function getTagNameImgHashId () {
		return scope.getTagNameImgHashId();
	}

	return scope;
}(MODULE || {}));

/*
function toggleImgViewStatus (isEnable) {
	if (isEnable) {
		serveWebCommImgStatus();
	} else {
		hideImgCommStatus();
	}
}

function persistWebCommImgStatusOnSuccess () {
	hideImgCommStatus ();
	
	// delete _imgCommData['webCommTooltips'];
	_imgCommData['webCommTooltips'] = [];
	var status = _imgCommData['webCommStatus'], store, text;
		
	$('img[' + _wcHashIdAttr + ']').each(function() {
		store = status[$(this).attr(_wcHashIdAttr)];
		if(store){
			text = store['count'] + getLocalString('tooltip_comments') ;
			
			showWrappedStatus($(this), text);

			// var tips = $(this).tooltipster({
			// 	content: $("<span><a href='show_comments'></a></span>").children().text(text),
			// 	// content: text,
			// 	autoClose: false,
			// 	multiple: true,
			// 	interactive: true,
			// 	trigger: 'custom',
			// 	position: 'bottom-left',
			// 	functionReady: onTooltipeReadyShowComm
			// });

			// // tips[0].show();
			
			// _imgCommData['webCommTooltips'].push(tips[0]);
		}
	});

}

function onTooltipeReadyShowComm (origin, tooltip) {
	onTooltipeReady (origin, tooltip);
}

function showWrappedStatus (jqImg, text) {
	jqImg.wrap("<div class='wrap-web-comm-img'></div>");
	jqImg.after("<span class='web-comm-img-status'>" + text + "</span>");

	clickShowPopupWebCommForm(jqImg, jqImg.next('span.web-comm-img-status'));
}

function hideWrappedStatus () {
	$('div.wrap-web-comm-img img').each(function() {
			$(this).unwrap().next().remove();
	});
}

function hideImgCommStatus () {
	var tips = _imgCommData['webCommTooltips'];
	for(i in tips) {
		tips[i].hide();
	}

	hideWrappedStatus ();
}

function showImgCommStatus () {
	var tips = _imgCommData['webCommTooltips'];
	for(i in tips) {
		tips[i].show();
	}
}

function serveWebCommImgStatus () {
	// console.log(_imgHashIdList);
	$.get(_serverURL + 'status', {imgHashIdList: _imgHashIdList} , onSuccessImageStatus).fail(onFailImageStatus);
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
	updateImgCommStatus ([]);
}

function updateImgCommStatus (data) {
	delete _imgCommData['webCommStatus'];
	_imgCommData['webCommStatus'] = {};
	console.log(data);
	$.map(data, function(obj, i) {
		obj = JSON.parse(obj);
		_imgCommData['webCommStatus'][obj.hashId] = obj;
			// ? _imgCommData['webCommStatus'][obj.hashId].push(obj)
			// 	: _imgCommData['webCommStatus'][obj.hashId] = [];
	});
}
*/