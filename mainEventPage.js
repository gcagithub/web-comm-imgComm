// chrome.tabs.insertCSS({file: 'css/style.css'});
// chrome.tabs.executeScript({file: 'js/jquery-2.1.1.min.js'});
// chrome.tabs.executeScript({file: 'js/imageselector.js'});

var iconTrigger;
changeIcon ({});

chrome.browserAction.onClicked.addListener(function(tab) {
	changeIcon (tab);
});

function changeIcon (tab) {

	var path;
	if(iconTrigger){
		path = 'images/icon1.png';
		// insertStyles(tab);
		isSelectionEnable(tab, true);
		iconTrigger = false;
	}else{
		path = 'images/icon5.png';
		isSelectionEnable(tab, false);
		iconTrigger = true;
	}

	chrome.browserAction.setIcon({path: path});
	
}

function isSelectionEnable (tab, isEnable) {
	if (!tab.id) return;

	chrome.tabs.sendMessage(tab.id, {selectImg: isEnable}, function(response) {
	    console.log(response.farewell);
	});
}

function insertStyles (tab) {
	chrome.tabs.insertCSS({file: 'css/style.css'});
}