// var _popupWidth = 400;
// var _jqImage;
// var _popupImgHTML = "popupImgCommForm.html";
// var _jqWebCommImgPopup;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	    // console.log(request);
	    // if (request.selectImg){
	    // 	sendResponse({farewell: "image selection enable"});
	    // } else {
	    // 	sendResponse({farewell: "image selection disable"});
	    // }

			request.selectImg ? sendResponse({farewell: "image selection enable"})
				: sendResponse({farewell: "image selection disable"});

			initPopupWebCommLayer();

    	toggleImgSelect(request.selectImg);
    	// showImgCommStatus.js
    	toggleImgViewStatus(request.selectImg);
});

function toggleImgSelect (isEnable) {
	if(!isEnable){
  		$("img").off( "mouseenter mouseleave" );
  		$("img").off( "click" );
  		return;
  }

	$("img").hover(
		function() {
			// $(this).css("border", "2px solid purple");
			$(this).css("opacity", "0.3");
			
		},
		function() {
			// $(this).css("border", "none");
			$(this).css("opacity", "1");
		}
	);

	$("img").click(function(e) {
		/* Prevent default actions */
		e.preventDefault();
		e.stopPropagation();

		_jqImage = $(this);
		loadPopupWebCommForm();
	});
    	
}

function initPopupWebCommLayer () {
	if(!_jqWebCommImgPopup){
		$("body").prepend("<div id='web-comm-img-popup'></div>");
		_jqWebCommImgPopup = $("#web-comm-img-popup");
	}
}

function loadPopupWebCommForm () {
	srcURL = chrome.extension.getURL(_popupImgHTML);
	_jqWebCommImgPopup.load(srcURL, showPopup, function() {
		console.log('Form was loaded successfull!');
	});
}

function showPopup () {
		$(window).resize(showPopup);
		$(window).scroll(showPopup);

    var winWidth = $(window).width();
    var winHeight = $(document).height();
    var scrollPos = $(window).scrollTop();
     
    /* Evaluate position */
     
    var disWidth = (winWidth - _popupWidth) / 2
    var disHeight = scrollPos + 50;
     
    _jqWebCommImgPopup.find('.web-comm-popup-box').css({'width' : _popupWidth+'px', 'left' : disWidth+'px', 'top' : disHeight+'px'});
    _jqWebCommImgPopup.css({'width' : winWidth+'px', 'height' : winHeight+'px'});
     
		/* Show the correct popup box, show the blackout and disable scrolling */
		_jqWebCommImgPopup.children().show();
		_jqWebCommImgPopup.show();
		$('html,body').css('overflow', 'hidden');
		
		/* Fixes a bug in Firefox */
		$('html').scrollTop(scrollPos);

		disablePopupImgClick ();
		closePopupImgBehaviour ();
		showImgInPopup();

		initFormSubmitEvent();
		initShowCommentsEvent();
		
    return false; 	
}

function showImgInPopup () {
	_jqWebCommImgPopup.find(".top img").attr('src', _jqImage.attr('src'));
	// _jqWebCommImgPopup.find(".top small").text(_jqImage.attr('src'));
}

function disablePopupImgClick () {
	_jqWebCommImgPopup.children().click(function(e) { 
		/* Stop the link working normally on click if it's linked to a popup */
		e.stopPropagation(); 
	});
}

function closePopupImgBehaviour () {
	$('html, #web-comm-img-popup .close').click(function() { 
		var scrollPos = $(window).scrollTop();
		/* Hide the popup and blackout when clicking outside the popup */
		_jqWebCommImgPopup.children().hide(); 
		_jqWebCommImgPopup.hide(); 
		$("html,body").css("overflow","auto");
		$('html').scrollTop(scrollPos);
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
  	sendWebComm($(this), _jqImage);
  }
}
