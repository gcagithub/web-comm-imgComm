var delta;
var imgCount;
var count = 0;

function activateImgHashProcess () {
	console.log('Start block hash!');
	delta = new Date().getTime();

	var imgList = $('img:not([' + _wcHashIdAttr + '])');
	imgCount = imgList.size();
	if (imgCount == 0) applicationActivity(true);

	console.log("imgCount = " + imgCount);
	
	imgList.each(function() {
		blockhashjs.blockhash($(this).attr('src'), 16, 1, blockHashResult.bind(this, $(this)));
	});

	// $('img').mouseover(function() {
	// 	blockhashjs.blockhash($(this).attr('src'), 16, 1, blockHashResult.bind(this, $(this)));
	// });

}

function blockHashResult (jqImg, error, result, imgData) {
	// console.log('End block hash! Time delta:' + (new Date().getTime() - delta));
	// console.log(result);
	imgCount --;
	if (error) {
		console.log('Hash block error! Imgsrc: ' + jqImg.attr('src'));
		console.log(error);
	} else if (imgData.width > 63 || imgData.height > 63) {
		count ++;
		jqImg.attr(_wcHashIdAttr, result);
		fillHashIdList(result);
	} else {
		console.log('w x h = ' + imgData.width + ' x ' + imgData.height);
	}
	// delta = new Date().getTime();

	if (imgCount == 0) {
		console.log('End block hash! Time delta:' + (new Date().getTime() - delta) + '. Img counted = ' + count);
		applicationActivity(true);	// webCommImgPopup.js
	}
}

function fillHashIdList (hashId) {
	if(!_imgHashIdList) _imgHashIdList = [];

	_imgHashIdList.push(hashId);
}

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