// var _serverURL = "http://localhost:8080/web-comm/";
// var _tmplImgComm;
// var _jqImage;


function sendWebComm (jqForm, jqImage) {
	_jqImage = jqImage;
	var data = {
		imgSrc: jqImage.attr('src'),
		comment: jqForm.find('textarea').val(),
		title: jqForm.find("input[name='title']").val(),
		createdOn: new Date().toJSON()
	};

	disableFormEventAndButtons(true);

	$.post(_serverURL + "postImgComm", data, handleWebCommResponseSuccess)
		.fail(handleWebCommResponseFail)
		.always(function() {disableFormEventAndButtons(false);});
}

function handleWebCommResponseSuccess (data, status, jqXHR) {
	logger('Comment post success!');
	logger(status);
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
	_tmplImgComm = _tmplImgComm ? _tmplImgComm : $.templates("#commentImgTmpl");
	$("#web-comm-form-comments").html(_tmplImgComm.render(JSON.parse(data)));

	// renderImgComments(jqXHR.responseText);
}

function updateImgComments (jqImage) {
	var src = jqImage.attr('src');
	$.get(_serverURL + "getImgComm",
		{hashId: encodeURI(src)},
		handleGetAllImgCommResponseSuccess).fail(handleWebCommResponseFail);
}

function handleGetAllImgCommResponseSuccess (data, status, jqXHR) {
	_imgCommCache = jqXHR.responseText;
	renderImgComments (jqXHR.responseText);
}

function disableFormEventAndButtons (isDisable) {
	if(isDisable) {
		_jqWebCommImgPopup.find('form').off('submit', submitFormEvent);
	} else {
		_jqWebCommImgPopup.find('form').on('submit', submitFormEvent);
	}
	_jqWebCommImgPopup.find('form button').prop( "disabled", isDisable );
}