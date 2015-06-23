/*
	Send image comment module.

	imports:
		getCurrentJQImage()
		getServerURL()
		getTagNameImgHashId()
		getJQWebCommImgPopup()
		submitFormEvent(e)

	exports:
		sendImgComm(jqForm)
		queryImgComments()

*/

var MODULE = (function(scope) {
	var tagNameHashId = scope.getTagNameImgHashId(),
			serverURL = scope.getServerURL(),
			tmplImgComm;

	this.queryImgComments = function  () {
		$.get(serverURL + "comments",
			{hashId: getCurrentJQImage().attr(tagNameHashId)},
			successQueryImgCommResponse).fail(failQueryImgCommResponse);
	}
	
	scope.queryImgComments = this.queryImgComments;

	scope.sendImgComm = function(jqForm) {
		var data = {
			imgSrc: getCurrentJQImage ().attr('src'),
			comment: jqForm.find('textarea').val(),
			title: jqForm.find("input[name='title']").val(),
			createdOn: new Date().toJSON(),
			hashId: getCurrentJQImage ().attr(tagNameHashId)
		};

		toggleFormEventAndButtons(true);

		$.post(serverURL + "create", data, successSendImgCommResponse)
			.fail(failSendImgCommResponse)
			.always(function() {toggleFormEventAndButtons(false);});
	}

	function getCurrentJQImage () {
		return scope.getJQCurrentImage();
	}

	function toggleFormEventAndButtons (isEnable) {
		if(!isEnable) {
				getJQWebCommImgPopup().find('form').off('submit', submitFormEvent);
			} else {
				getJQWebCommImgPopup().find('form').on('submit', submitFormEvent);
			}
			getJQWebCommImgPopup().find('form button').prop( "disabled", !isEnable );
	}

	function successSendImgCommResponse (data, status, jqXHR) {
		console.log('Comment post success!');
		console.log(status);

		emptyFormFields ();
		queryImgComments();
	}

	function failSendImgCommResponse (data, status, jqXHR) {
		console.log("Fail send comment!");
		console.log(status);
	}

	function getJQWebCommImgPopup () {
		return scope.getJQWebCommImgPopup ();
	}

	function submitFormEvent (e) {
		return scope.submitFormEvent(e);
	}

	function emptyFormFields () {
		getJQWebCommImgPopup().find('form input, form textarea').val('');
	}

	function queryImgComments () {
		return this.queryImgComments();
	}

	function failQueryImgCommResponse (data, status, jqXHR) {
		console.log("Fail send comment!");
		console.log(status);
	}

	function successQueryImgCommResponse (data, status, jqXHR) {
		console.log('success query');
		renderImgComments (JSON.parse(jqXHR.responseText));
	}

	function renderImgComments (data) {
		var parsedResult = [];
		for(var i in data.result) {
			parsedResult.push(JSON.parse(data.result[i]));
		}
		tmplImgComm = tmplImgComm ? tmplImgComm : $.templates("#commentImgTmpl");
		$("#web-comm-form-comments").html(tmplImgComm.render(parsedResult));
	}

	return scope;

}(MODULE || {}));

/*
function sendWebComm (jqForm, jqImage) {
	_jqImage = jqImage;
	var data = {
		imgSrc: jqImage.attr('src'),
		comment: jqForm.find('textarea').val(),
		title: jqForm.find("input[name='title']").val(),
		createdOn: new Date().toJSON(),
		hashId: jqImage.attr(_wcHashIdAttr)
	};

	disableFormEventAndButtons(true);

	$.post(_serverURL + "create", data, handleWebCommResponseSuccess)
		.fail(handleWebCommResponseFail)
		.always(function() {disableFormEventAndButtons(false);});
}

function handleWebCommResponseSuccess (data, status, jqXHR) {
	logger('Comment post success!');
	logger(status);

	emptyFormFields ();
	updateImgComments(_jqImage);
}

function handleWebCommResponseFail (data, status, jqXHR) {
	logger("Fail send comment!");
	logger(status);
}


function logger (obj) {
	console.log(obj);
}

function renderImgComments (data) {
	var results = [];
	for(var i in data.result) {
		results.push(JSON.parse(data.result[i]));
	}
	_tmplImgComm = _tmplImgComm ? _tmplImgComm : $.templates("#commentImgTmpl");
	$("#web-comm-form-comments").html(_tmplImgComm.render(results));

	// renderImgComments(jqXHR.responseText);
}

function updateImgComments (jqImage) {
	$.get(_serverURL + "comments",
		{hashId: jqImage.attr(_wcHashIdAttr)},
		handleGetAllImgCommResponseSuccess).fail(handleWebCommResponseFail);
}

function handleGetAllImgCommResponseSuccess (data, status, jqXHR) {
	var response = JSON.parse(jqXHR.responseText)
	_imgCommCache = response;
	renderImgComments (response);
}

function disableFormEventAndButtons (isDisable) {
	if(isDisable) {
		_jqWebCommImgPopup.find('form').off('submit', submitFormEvent);
	} else {
		_jqWebCommImgPopup.find('form').on('submit', submitFormEvent);
	}
	_jqWebCommImgPopup.find('form button').prop( "disabled", isDisable );
}

function emptyFormFields () {
	_jqWebCommImgPopup.find('form input, form textarea').val('');
}
*/