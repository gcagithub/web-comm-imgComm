var delta;
var imgCount;

function initOnStartProcess () {
	console.log('Start block hash!');
	delta = new Date().getTime();
	var imgList = $('img:not([' + _wcHashIdAttr + '])');
	imgCount = imgList.size();
	console.log("imgCount = " + imgCount);
	imgList.each(function() {
		blockhashjs.blockhash($(this).attr('src'), 16, 1, blockHashResult.bind(this, $(this)));
		// imgRawConverter (jqCurrentHashedImg.attr('src'));
	});

	// $('img').on('mouseover', function() {
	// 	delta = new Date().getTime();
	// 	jqCurrentHashedImg = $(this);
	// 	// imgRawConverter (jqCurrentHashedImg.attr('src'));
	// 	blockhashjs.blockhash(jqCurrentHashedImg.attr('src'), 16, 1, blockHashResult);
	// 	blockhashjs.blockhash(jqCurrentHashedImg.attr('src'), 16, 3, blockHashResult);
	// });
}

function blockHashResult (jqImg, error, result) {
	imgCount --;
	// console.log('End block hash! Time delta:' + (new Date().getTime() - delta));
	// console.log("imgCount - " + imgCount);
	if (error) {
		console.log('Hash block error! Imgsrc: ' + jqImg.attr('src'));
		console.log(error);
	} else {
		jqImg.attr(_wcHashIdAttr, result);
		fillHashIdList(result);
	}
	// delta = new Date().getTime();

	if (imgCount == 0) {
		console.log('End block hash! Time delta:' + (new Date().getTime() - delta));
		toggleMainFuns(true);	
	}
}

function fillHashIdList (hashId) {
	if(!_imgHashIdList) _imgHashIdList = [];

	_imgHashIdList.push(hashId);
}

function imgRawConverter (imgSrc) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', imgSrc, true);
	xhr.responseType = 'arraybuffer'; // this will accept the response as an ArrayBuffer
	xhr.onload = function() {
	    var words = new Uint8Array(xhr.response),
	        hex = '';
	    console.log("Src: " + imgSrc);
	    console.log("words: ");
	    console.log(words);
	    for (var i = 0; i < words.length; i++) {
	      hex += words[i].toString(16);  // this will convert it to a 4byte hex string
	    }
	    
	    console.log('hex: ' + hex);

	};
	xhr.send();
}