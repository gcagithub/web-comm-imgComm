// chrome.tabs.insertCSS({file: 'css/style.css'});
// chrome.tabs.executeScript({file: 'js/jquery-2.1.1.min.js'});
// chrome.tabs.executeScript({file: 'js/imageselector.js'});

var _tabIdsPersistence = [];
var _tabId;

chrome.browserAction.onClicked.addListener(function(tab) {
	_tabId = tab.id;
	saveOrRemoveTabId (tab.id);
	triggerExtension (tab.id);
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
	_tabId = activeInfo.tabId;
	triggerExtension (activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function(tabId){
	_tabId = tabId;
	triggerExtension (tabId);
});

chrome.tabs.onRemoved.addListener(function(tabId){
	if(isExtensionActive (tabId)){
		saveOrRemoveTabId (tabId);
	}
});

chrome.runtime.onSuspend.addListener(function (){
	// saveOrRemoveTabId (_tabId);
	// triggerExtension (_tabId);
});

function triggerExtension (tabId) {
	var path;
	if(isExtensionActive (tabId)){
		path = 'images/iconActive.png';
		sendMessageToContentScripts(tabId, true);
	}else{
		path = 'images/iconInactive.png';
		sendMessageToContentScripts(tabId, false);
	}

	chrome.browserAction.setIcon({path: path});

}

function sendMessageToContentScripts (tabId, isEnable) {
	if (!tabId) return;

	chrome.tabs.sendMessage(tabId, {selectImg: isEnable}, function(response) {
	    console.log(response.farewell);
	});
}

function isExtensionActive (tabId) {
	for (i in _tabIdsPersistence) {
		if (_tabIdsPersistence[i] === tabId) return true;
	};
	return false;
}

function saveOrRemoveTabId (tabId) {
	var index = _tabIdsPersistence.indexOf(tabId);
	index == -1 ? _tabIdsPersistence.push(tabId) : delete _tabIdsPersistence[index];
}

