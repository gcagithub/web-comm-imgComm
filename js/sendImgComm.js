// var _serverURL = "http://localhost:8080/web-comm/";
// var _tmplImgComm;
// var _jqImage;


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

	$.post(_serverURL + "postImgComm", data, handleWebCommResponseSuccess)
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
	$.get(_serverURL + "getImgComm",
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