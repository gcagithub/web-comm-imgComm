var delta;
var hashedImg;

$(function() {
	console.log('Start block hash!');
	delta = new Date().getTime();
	$('img').each(function() {
		hashedImg = $(this);
		blockhashjs.blockhash(hashedImg.attr('src'), 16, 1, blockhashResult);
		// imgRawConverter (hashedImg.attr('src'));
	});

	$('img').on('mouseover', function() {
		delta = new Date().getTime();
		hashedImg = $(this);
		// imgRawConverter (hashedImg.attr('src'));
		blockhashjs.blockhash(hashedImg.attr('src'), 16, 1, blockhashResult);
		blockhashjs.blockhash(hashedImg.attr('src'), 16, 3, blockhashResult);
	});

});

function blockhashResult (error, result) {
	console.log('End block hash! Time delta:' + (new Date().getTime() - delta));
	if (error) {
		console.log('Hash block error! Imgsrc: ' + hashedImg.attr('src'));
		console.log(error);
	} else {
		console.log('Hash block result = ' + result);
	}

	delta = new Date().getTime();
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