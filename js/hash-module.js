/*
	Hash image module.

	imports:
		applicationActivity(true)

	exports:
		startHashProcess()
		getHashIdList()

*/

var MODULE = (function(scope) {
	var	delta,
			imgCount,
			counter = 0,
			imgHashIdList = [];

	scope.startHashProcess = function () {
		console.log('Start block hash!');
		delta = new Date().getTime();

		var imgList = $('img:not([' + scope.getTagNameImgHashId() + '])');
		imgCount = imgList.size();	

		if (imgCount == 0) startMainApplication ();

		console.log("imgCount = " + imgCount);

		imgList.each(function() {
			blockhashjs.blockhash($(this).attr('src'), 16, 1, blockHashResult.bind(this, $(this)));
		});

	}

	scope.getHashIdList = function () {
		return imgHashIdList;
	}

	function blockHashResult (jqImg, error, result, imgData) {
		imgCount --;
		if (error) {
			console.log('Hash block error! Imgsrc: ' + jqImg.attr('src'));
			console.log(error);
		} else if (imgData.width > 63 || imgData.height > 63) {
			counter ++;
			jqImg.attr(scope.getTagNameImgHashId(), result);
			saveHashId(result);
		} else {
			console.log('w x h = ' + imgData.width + ' x ' + imgData.height);
		}
		// delta = new Date().getTime();

		if (imgCount == 0) {
			console.log('End block hash! Time delta:' + (new Date().getTime() - delta) + '. Img counted = ' + counter);
			startMainApplication ();
		}
	}

	function startMainApplication () {
		scope.applicationActivity(true);
	}

	function saveHashId (hashId) {
		var index = imgHashIdList.indexOf(hashId);
		if (index == -1)
			imgHashIdList.push(hashId);
	}

	return scope;

}(MODULE || {}));

// function imgRawConverter (imgSrc) {
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('GET', imgSrc, true);
// 	xhr.responseType = 'arraybuffer'; // this will accept the response as an ArrayBuffer
// 	xhr.onload = function() {
// 	    var words = new Uint8Array(xhr.response),
// 	        hex = '';
// 	    console.log("Src: " + imgSrc);
// 	    console.log("words: ");
// 	    console.log(words);
// 	    for (var i = 0; i < words.length; i++) {
// 	      hex += words[i].toString(16);  // this will convert it to a 4byte hex string
// 	    }
	    
// 	    console.log('hex: ' + hex);

// 	};
// 	xhr.send();
// }