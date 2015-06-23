var MODULE = MODULE || {};

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

			request.selectImg ? sendResponse({farewell: "image selection enable"})
				: sendResponse({farewell: "image selection disable"});

			if (request.selectImg) {
				MODULE.startHashProcess();
			} else {
				MODULE.applicationActivity(request.selectImg);
			}

});