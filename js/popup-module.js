/*
	Popup module.

	imports:
		CONFIG module
		toggleImgCommTooltips(true|false)
		toggleImgStatus(true|false)
		hideImgStatus()
		queryImgComments ()
		requestImgStatus()
		sendImgComm(jqObj)

	exports:
		applicationActivity(true|false)
		clickShowPopupWebCommForm(jqObj, jqTarget)
		getLocalizeString(String)
		getJQCurrentImage()

*/

var MODULE = (function(scope) {
	var jqWebCommImgPopup, jqCurrentImage, lng,
			popupWidth = scope.getPopupFormWidth();

	this.getJQCurrentImage = function () {
		return jqCurrentImage;
	}

	this.getLocalizeString = function (key) {
		var tmpl = scope.getLocalizeTmpls()[getLocale()] || scope.getLocalizeTmpls()['en'];
		return key ? tmpl[key] : tmpl;
	}
	
	this.getJQPopupWebCommLayer = function () {
		if(!jqWebCommImgPopup){
			$("body").prepend("<div id='web-comm-img-popup'></div>");
			jqWebCommImgPopup = $("#web-comm-img-popup");
		}
		return jqWebCommImgPopup;
	}

	scope.getJQPopupWebCommLayer = this.getJQPopupWebCommLayer;

	scope.getLocalizeString = this.getLocalizeString;	

	scope.applicationActivity = function (isEnable) {
		scope.toggleImgCommTooltips(isEnable);
		scope.toggleImgStatus(isEnable);
	}

	scope.clickShowPopupWebCommForm = function (jqObj, jqTarget) {
		jqTarget.click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			jqCurrentImage = jqObj;

			hideImgStatus()

			loadPopupWebCommForm();
		});
	}

	scope.getJQCurrentImage = this.getJQCurrentImage;

	function getJQPopupWebCommLayer () {
		return this.getJQPopupWebCommLayer();
	}

	function hideImgStatus () {
		scope.hideImgStatus ();
	}

	function loadPopupWebCommForm () {
		var srcURL = chrome.extension.getURL(scope.getPopupFormFileName());
		getJQPopupWebCommLayer().load(srcURL, function( response, status, xhr ) {
			console.log('Form was loaded successfull!');
			showPopup ();
		});

	}


	function removeJQPopupWebCommLayer () {
		jqWebCommImgPopup = null;
	}

	function showPopup () {
	  var winWidth = $(window).width();
    var winHeight = $(document).height();
    var scrollPos = $(window).scrollTop();
     
    /* Evaluate position */
     
    var disWidth = (winWidth - popupWidth) / 2
    var disHeight = scrollPos + 50;
     
    getJQPopupWebCommLayer().find('.web-comm-popup-box').css({'width' : popupWidth+'px', 'left' : disWidth+'px', 'top' : disHeight+'px'});
    getJQPopupWebCommLayer().css({'width' : winWidth+'px', 'height' : winHeight+'px'});
     
		/* Show the correct popup box, show the blackout and disable scrolling */
		localizeImgPopup();

		getJQPopupWebCommLayer().children().show();
		getJQPopupWebCommLayer().show();

		disablePopupImgClick ();
		initClosePopupImgBehaviour ();
		showImgInPopup();

		initFormSubmitEvent();
		initShowCommentsEvent();

		scope.queryImgComments ();

	}

	function localizeImgPopup () {
		var content = getJQPopupWebCommLayer().find('.web-comm-popup-box:first').html();

		for(i in getLocalizeString()) {
			content = content.replace(i, getLocalizeString(i));
		}
		getJQPopupWebCommLayer().find('.web-comm-popup-box:first').html(content);
		
	}


	function getLocalizeString (key) {
		return this.getLocalizeString(key);
	}

	function getLocale () {
		if (!lng) {
			lng = $('html').attr('lang')
				|| navigator.browserLanguage
				|| navigator.language
				|| navigator.userLanguage;

			lng = lng.substring(0,2);
		}
		return lng;
	}

	function disablePopupImgClick () {
		getJQPopupWebCommLayer().children().click(function(e) { 
			/* Stop the link working normally on click if it's linked to a popup */
			e.stopPropagation(); 
		});
	}

	function initClosePopupImgBehaviour () {
		$('#web-comm-img-popup, #web-comm-img-popup .close').click(function() { 
			/* Hide the popup and blackout when clicking outside the popup */
			getJQPopupWebCommLayer().children().hide(); 
			getJQPopupWebCommLayer().hide(); 
			getJQPopupWebCommLayer().remove();
			removeJQPopupWebCommLayer();
			scope.requestImgStatus();
		});
	}

	function showImgInPopup () {
		var img = "<img class='center-block' src='" + getJQCurrentImage().attr('src') + "' />";
		getJQPopupWebCommLayer().find(".thumbnail").prepend(img);
	}

	function initFormSubmitEvent () {
		getJQPopupWebCommLayer().find("form").off();
	  getJQPopupWebCommLayer().find("form").submit(submitFormEvent);
	}

	function initShowCommentsEvent () {
		$("button#web-comm-ShowComments").click(function() {
			scope.queryImgComments();
		});
	}

	function submitFormEvent (e) {
		e.preventDefault();

	  if ($(this).find('textarea').val() == 0) {
	  		alert("Empty comment");
	  } else {
	  	scope.sendImgComm($(this));
	  }
	}

	return scope;
}(MODULE || {}));

/*
function applicationActivity (isEnable) {
	console.log('applicationActivity ' + isEnable);
	toggleImgCommTooltips(isEnable);
	// toggleImgViewStatus(isEnable); // showImgCommStatus.js
	IMG_COMM_STATUS.toggleImgStatus(isEnable);
}

function toggleImgCommTooltips (isEnable) {
	if (isEnable) {
		if(!$('img[' + _wcHashIdAttr + ']').hasClass('tooltipstered')) {
			var title = getLocalString('tooltip_create_comment');
			_toolTipsterOpenForm = $('img[' + _wcHashIdAttr + ']').tooltipster({
					content: $("<span><a href='create_comment'></a></span>").children().text(title),
					position: 'bottom-left',
					interactive : true,
					multiple: true,
					theme: "tooltipster-noir",
					functionReady: onTooltipeReady,
					functionAfter: onTooltipeAfter
			});
		}
		tooltipsEnable ();
	} else {
		tooltipsDisable ();
	}
	
}

function tooltipsEnable () {
 	for(i in _toolTipsterOpenForm){
 		_toolTipsterOpenForm[i].enable();
 	}

	var tips = _imgCommData['webCommTooltips'];
	for(i in tips) {
		tips[i].enabled = true;
	}
}

function tooltipsDisable () {
 for(i in _toolTipsterOpenForm){
 	_toolTipsterOpenForm[i].hide();
 		_toolTipsterOpenForm[i].disable();
 	}

	var tips = _imgCommData['webCommTooltips'];
	for(i in tips) {
		tips[i].enabled = false;
	}
}

function onTooltipeAfter (origin) {
	// body...
}

function onTooltipeReady (origin, tooltip) {
	clickShowPopupWebCommForm (origin, tooltip);
}

function clickShowPopupWebCommForm (jqObj, jqTarget) {
	jqTarget.click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		_jqImage = jqObj;

		IMG_COMM_STATUS.hideImgStatus ();

		loadPopupWebCommForm();
	});
}

function getCurrentJQImage () {
	return _jqImage;
}

function getJQWebCommImgPopup () {
	return _jqWebCommImgPopup;
}

// function toggleImgSelect (isEnable) {
// 	if(!isEnable){
//   		$("img").off( "mouseenter mouseleave" );
//   		$("img").off( "click" );
//   		return;
//   }

// 	$("img").hover(
// 		function() {
// 			// $(this).css("border", "2px solid purple");
// 			$(this).css("opacity", "0.3");
// 		},
// 		function() {
// 			// $(this).css("border", "none");
// 			$(this).css("opacity", "1");
// 		}
// 	);

// 	$("span .web-comm-open-popup").click(function(e) {
		 // Prevent default actions 
// 		e.preventDefault();
// 		e.stopPropagation();

// 		_jqImage = $(this);
// 		loadPopupWebCommForm();
// 	});
    	
// }

function initPopupWebCommLayer () {
	if(!_jqWebCommImgPopup){
		$("body").prepend("<div id='web-comm-img-popup'></div>");
		_jqWebCommImgPopup = $("#web-comm-img-popup");
	}
}

function loadPopupWebCommForm () {
	initPopupWebCommLayer();

	srcURL = chrome.extension.getURL(_popupImgHTML);
	_jqWebCommImgPopup.load(srcURL, function( response, status, xhr ) {
		console.log('Form was loaded successfull!');
		showPopup ();
	});

}

function showPopup () {
		// $(window).resize(showPopup);
		// $(window).scroll(showPopup);

    var winWidth = $(window).width();
    var winHeight = $(document).height();
    var scrollPos = $(window).scrollTop();
     
    // Evaluate position
     
    var disWidth = (winWidth - _popupWidth) / 2
    var disHeight = scrollPos + 50;
     
    _jqWebCommImgPopup.find('.web-comm-popup-box').css({'width' : _popupWidth+'px', 'left' : disWidth+'px', 'top' : disHeight+'px'});
    _jqWebCommImgPopup.css({'width' : winWidth+'px', 'height' : winHeight+'px'});
     
		 // Show the correct popup box, show the blackout and disable scrolling 
		localizeImgPopup();

		_jqWebCommImgPopup.children().show();
		_jqWebCommImgPopup.show();
		// $('html,body').css('overflow', 'hidden');
		
		 // Fixes a bug in Firefox 
		// $('html').scrollTop(scrollPos);

		disablePopupImgClick ();
		initClosePopupImgBehaviour ();
		showImgInPopup();

		initFormSubmitEvent();
		initShowCommentsEvent();

		SEND_IMG_COMM.queryImgComments ();
		
}

function showImgInPopup () {
	var img = "<img class='center-block' src='" + _jqImage.attr('src') + "' />";
	_jqWebCommImgPopup.find(".thumbnail").prepend(img);
	// attr('src', _jqImage.attr('src'));
	// _jqWebCommImgPopup.find(".top small").text(_jqImage.attr('src'));
}

function disablePopupImgClick () {
	_jqWebCommImgPopup.children().click(function(e) { 
		 // Stop the link working normally on click if it's linked to a popup 
		e.stopPropagation(); 
	});
}

function initClosePopupImgBehaviour () {
	$('#web-comm-img-popup, #web-comm-img-popup .close').click(function() { 
		var scrollPos = $(window).scrollTop();
		 // Hide the popup and blackout when clicking outside the popup 
		_jqWebCommImgPopup.children().hide(); 
		_jqWebCommImgPopup.hide(); 
		// $("body").css("overflow","auto");
		// $("html").css("overflow","auto");

		// $('html').scrollTop(scrollPos);

		// _jqWebCommImgPopup.find('.thumbnail img').remove();
		_jqWebCommImgPopup.remove();
		_jqWebCommImgPopup = null;
		IMG_COMM_STATUS.requestImgStatus();
	});
}


// sendImgComm.js for below

function initFormSubmitEvent () {
	_jqWebCommImgPopup.find("form").off();
  _jqWebCommImgPopup.find("form").submit(submitFormEvent);
}

function initShowCommentsEvent () {
	$("button#web-comm-ShowComments").click(function() {
		updateImgComments (_jqImage);
	});
}

function submitFormEvent (e) {
	e.preventDefault();

  if ($(this).find('textarea').val() == 0) {
  		alert("Empty comment");
  } else {
  	SEND_IMG_COMM.sendImgComm($(this));
  }
}

function defineLocal () {
	var lng = $('html').attr('lang')
		|| navigator.browserLanguage
		|| navigator.language
		|| navigator.userLanguage;

	_lang = lng.substring(0,2);
	// console.log('lang: ' + _lang);
}

function getLocalString (key) {
	if(!_lang) defineLocal ();

	var tmpl = _localTmpls[_lang] || _localTmpls['en'];
	return key ? tmpl[key] : tmpl;
}

function localizeImgPopup () {
	var content = _jqWebCommImgPopup.find('.web-comm-popup-box:first').html();

	for(i in getLocalString()) {
		content = content.replace(i, getLocalString(i));
	}
	_jqWebCommImgPopup.find('.web-comm-popup-box:first').html(content);
	
}
*/