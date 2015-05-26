var iconTrigger;

chrome.browserAction.onClicked.addListener(function() {
	if(iconTrigger){
		iconTrigger = false;
		chrome.browserAction.setIcon({path:"img/icon.png"});
	}else{
		iconTrigger = true;
		chrome.browserAction.setIcon({path:"img/WebCom_logo_24x24.png"});
	}
});