var serverURL = "http://localhost:8080/web-comm/";
var tmplImgComm;
var _jqImage;


function sendWebComm (jqForm, jqImage) {
	_jqImage = jqImage;
	var data = {
		imgSrc: jqImage.attr('src'),
		comment: jqForm.find('textarea').val(),
		title: jqForm.find("input[name='title']").val(),
		createdOn: new Date().toJSON()
	};

	$.post(serverURL + "postImgComm", data, handleWebCommResponseSuccess).fail(handleWebCommResponseFail);
}

function handleWebCommResponseSuccess (data, status, jqXHR) {
	logger(status);
	logger(jqXHR.responseText);
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
	logger(JSON.parse(data));
	tmplImgComm = tmplImgComm ? tmplImgComm : $.templates("#commentImgTmpl");
	$("#web-comm-form-comments").html(tmplImgComm.render(JSON.parse(data)));

	// renderImgComments(jqXHR.responseText);
}

function updateImgComments (jqImage) {
	var src = jqImage.attr('src');
	var data = {hashId: encodeURI(src)};
	$.get(serverURL + "getImgComm",
		data,
		handleGetAllImgCommResponseSuccess).fail(handleWebCommResponseFail);
}

function handleGetAllImgCommResponseSuccess (data, status, jqXHR) {
	renderImgComments (jqXHR.responseText);
}

// function initViewConverters () {
// 	$.views.converters("dateTime", function(val) {
// 		var date = new Date(val);

//   	return date.getDate() + " / " + (date.getMonth() + 1) + " / " + date.getFullYear()
//   					+ " " + date.getHours() + ":" + date.getMinutes();
// 	});
// }