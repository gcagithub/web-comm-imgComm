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

			toggleImgCommTooltips(request.selectImg);
    	// toggleImgSelect(request.selectImg);
    	// showImgCommStatus.js
    	toggleImgViewStatus(request.selectImg);

    	console.log(request.selectImg);
});

function toggleImgCommTooltips (isEnable) {
	if(!$('img').hasClass('tooltipstered')) {
		_toolTipsterOpenForm = $('img').tooltipster({
					content: $("<span><a href='create_comment'>Create comment</a></span>"),
					position: 'bottom-left',
					interactive : true,
					multiple: true,
					theme: "tooltipster-noir",
					functionReady: onTooltipeReady,
					functionAfter: onTooltipeAfter
		});
		tooltipsDisable ();
	} else if (isEnable) {
		tooltipsEnable ();
	} else {
		tooltipsDisable ();
	}
	
}

function tooltipsEnable () {
 	if(!_toolTipsterOpenForm[0].enabled){
 		$('img').tooltipster('enable');
 	}
	var tips = _imgCommTooltips['webCommTooltips'];
	for(i in tips) {
		tips[i].enabled = true;
	}
}

function tooltipsDisable () {
	if(_toolTipsterOpenForm[0].enabled){
 		$('img').tooltipster('disable');
 	}
	var tips = _imgCommTooltips['webCommTooltips'];
	for(i in tips) {
		tips[i].enabled = false;
	}
}

function onTooltipeAfter (origin) {
	// body...
}

function onTooltipeReady (origin, tooltip) {
	tooltip.click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		_jqImage = origin;

		hideImgCommStatus ();

		loadPopupWebCommForm();
	});
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
// 		/* Prevent default actions */
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
	console.log('Show popup');
		// $(window).resize(showPopup);
		// $(window).scroll(showPopup);
		_jqWebCommImgPopup.show();

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
		// $('html,body').css('overflow', 'hidden');
		
		/* Fixes a bug in Firefox */
		// $('html').scrollTop(scrollPos);

		disablePopupImgClick ();
		closePopupImgBehaviour ();
		showImgInPopup();

		initFormSubmitEvent();
		initShowCommentsEvent();
		
}

function showImgInPopup () {
	var img = "<img class='center-block' src='" + _jqImage.attr('src') + "' />";
	_jqWebCommImgPopup.find(".thumbnail").prepend(img);
	// attr('src', _jqImage.attr('src'));
	// _jqWebCommImgPopup.find(".top small").text(_jqImage.attr('src'));
}

function disablePopupImgClick () {
	_jqWebCommImgPopup.children().click(function(e) { 
		/* Stop the link working normally on click if it's linked to a popup */
		e.stopPropagation(); 
	});
}

function closePopupImgBehaviour () {
	$('#web-comm-img-popup, #web-comm-img-popup .close').click(function() { 
		var scrollPos = $(window).scrollTop();
		/* Hide the popup and blackout when clicking outside the popup */
		_jqWebCommImgPopup.children().hide(); 
		_jqWebCommImgPopup.hide(); 
		// $("body").css("overflow","auto");
		// $("html").css("overflow","auto");

		// $('html').scrollTop(scrollPos);

		// _jqWebCommImgPopup.find('.thumbnail img').remove();
		_jqWebCommImgPopup.remove();
		_jqWebCommImgPopup = null;
		serveWebCommImgStatus();
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
