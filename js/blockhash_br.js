(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.blockhashjs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Perceptual image hash calculation tool based on algorithm descibed in
// Block Mean Value Based Image Perceptual Hashing by Bian Yang, Fan Gu and Xiamu Niu
//
// Copyright 2014 Commons Machinery http://commonsmachinery.se/
// Distributed under an MIT license, please see LICENSE in the top dir.

var PNG = require('png-js');
var jpeg = require('jpeg-js');
var omggif = require('omggif');

var one_bits = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];

/* Calculate the hamming distance for two hashes in hex format */
var hammingDistance = function(hash1, hash2) {
    var d = 0;
    var i;
    for (i = 0; i < hash1.length; i++) {
        var n1 = parseInt(hash1[i], 16);
        var n2 = parseInt(hash2[i], 16);
        d += one_bits[n1 ^ n2];
    }
    return d;
};

var median = function(data) {
    var mdarr = data.slice(0);
    mdarr.sort(function(a, b) { return a-b; });
    if (mdarr.length % 2 === 0) {
        return (mdarr[mdarr.length/2] + mdarr[mdarr.length/2 + 1]) / 2.0;
    }
    return mdarr[Math.floor(mdarr.length/2)];
};

var bits_to_hexhash = function(bitsArray) {
    var hex = [];
    for (var i = 0; i < bitsArray.length; i += 4) {
        var nibble = bitsArray.slice(i, i + 4);
        hex.push(parseInt(nibble.join(''), 2).toString(16));
    }

    return hex.join('');
};

var bmvbhash_even = function(data, bits) {
    var blocksize_x = Math.floor(data.width / bits);
    var blocksize_y = Math.floor(data.height / bits);

    var result = [];

    for (var y = 0; y < bits; y++) {
        for (var x = 0; x < bits; x++) {
            var total = 0;

            for (var iy = 0; iy < blocksize_y; iy++) {
                for (var ix = 0; ix < blocksize_x; ix++) {
                    var cx = x * blocksize_x + ix;
                    var cy = y * blocksize_y + iy;
                    var ii = (cy * data.width + cx) * 4;

                    var alpha = data.data[ii+3];
                    if (alpha === 0) {
                        total += 765;
                    } else {
                        total += data.data[ii] + data.data[ii+1] + data.data[ii+2];
                    }
                }
            }

            result.push(total);
        }
    }

    var m = [];
    for (var i = 0; i < 4; i++) {
        m[i] = median(result.slice(i*bits*bits/4, i*bits*bits/4+bits*bits/4));
    }
    for (var i = 0; i < bits * bits; i++) {
        if (  ((result[i] < m[0]) && (i < bits*bits/4))
            ||((result[i] < m[1]) && (i >= bits*bits/4) && (i < bits*bits/2))
            ||((result[i] < m[2]) && (i >= bits*bits/2) && (i < bits*bits/4+bits*bits/2))
            ||((result[i] < m[3]) && (i >= bits*bits/2+bits*bits/4))
            ) {
           result[i] = 0;
        } else {
           result[i] = 1;
        }
    }

    return bits_to_hexhash(result);
};

var bmvbhash = function(data, bits) {
    var result = [];

    var i, j, x, y;
    var block_width, block_height;
    var weight_top, weight_bottom, weight_left, weight_right;
    var block_top, block_bottom, block_left, block_right;
    var y_mod, y_frac, y_int;
    var x_mod, x_frac, x_int;
    var blocks = [];

    var even_x = data.width % bits === 0;
    var even_y = data.height % bits === 0;

    if (even_x && even_y) {
        return bmvbhash_even(data, bits);
    }

    // initialize blocks array with 0s
    for (i = 0; i < bits; i++) {
        blocks.push([]);
        for (j = 0; j < bits; j++) {
            blocks[i].push(0);
        }
    }

    block_width = data.width / bits;
    block_height = data.height / bits;

    for (y = 0; y < data.height; y++) {
        if (even_y) {
            // don't bother dividing y, if the size evenly divides by bits
            block_top = block_bottom = Math.floor(y / block_height);
            weight_top = 1;
            weight_bottom = 0;
        } else {
            y_mod = (y + 1) % block_height;
            y_frac = y_mod - Math.floor(y_mod);
            y_int = y_mod - y_frac;

            weight_top = (1 - y_frac);
            weight_bottom = (y_frac);

            // y_int will be 0 on bottom/right borders and on block boundaries
            if (y_int > 0 || (y + 1) === data.height) {
                block_top = block_bottom = Math.floor(y / block_height);
            } else {
                block_top = Math.floor(y / block_height);
                block_bottom = Math.ceil(y / block_height);
            }
        }

        for (x = 0; x < data.width; x++) {
            var ii = (y * data.width + x) * 4;

            var avgvalue, alpha = data.data[ii+3];
            if (alpha === 0) {
                avgvalue = 765;
            } else {
                avgvalue = data.data[ii] + data.data[ii+1] + data.data[ii+2];
            }

            if (even_x) {
                block_left = block_right = Math.floor(x / block_width);
                weight_left = 1;
                weight_right = 0;
            } else {
                x_mod = (x + 1) % block_width;
                x_frac = x_mod - Math.floor(x_mod);
                x_int = x_mod - x_frac;

                weight_left = (1 - x_frac);
                weight_right = x_frac;

                // x_int will be 0 on bottom/right borders and on block boundaries
                if (x_int > 0 || (x + 1) === data.width) {
                    block_left = block_right = Math.floor(x / block_width);
                } else {
                    block_left = Math.floor(x / block_width);
                    block_right = Math.ceil(x / block_width);
                }
            }

            // add weighted pixel value to relevant blocks
            blocks[block_top][block_left] += avgvalue * weight_top * weight_left;
            blocks[block_top][block_right] += avgvalue * weight_top * weight_right;
            blocks[block_bottom][block_left] += avgvalue * weight_bottom * weight_left;
            blocks[block_bottom][block_right] += avgvalue * weight_bottom * weight_right;
        }
    }

    for (i = 0; i < bits; i++) {
        for (j = 0; j < bits; j++) {
            result.push(blocks[i][j]);
        }
    }

    var m = [];
    for (var i = 0; i < 4; i++) {
        m[i] = median(result.slice(i*bits*bits/4, i*bits*bits/4+bits*bits/4));
    }
    for (var i = 0; i < bits * bits; i++) {
        if (  ((result[i] < m[0]) && (i < bits*bits/4))
            ||((result[i] < m[1]) && (i >= bits*bits/4) && (i < bits*bits/2))
            ||((result[i] < m[2]) && (i >= bits*bits/2) && (i < bits*bits/4+bits*bits/2))
            ||((result[i] < m[3]) && (i >= bits*bits/2+bits*bits/4))
            ) {
           result[i] = 0;
        } else {
           result[i] = 1;
        }
    }

    return bits_to_hexhash(result);
};

var blockhashData = function(imgData, bits, method) {
    var hash;

    if (method === 1) {
        hash = bmvbhash_even(imgData, bits);
    }
    else if (method === 2) {
        hash = bmvbhash(imgData, bits);
    }
    else {
        throw new Error("Bad hashing method");
    }

    return hash;
};

var gifChecker = function (buf) {
    var p = 0;

  // - Header (GIF87a or GIF89a).
  if (buf[p++] !== 0x47 ||            buf[p++] !== 0x49 || buf[p++] !== 0x46 ||
      buf[p++] !== 0x38 || (buf[p++]+1 & 0xfd) !== 0x38 || buf[p++] !== 0x61) {
    // throw "Invalid GIF 87a/89a header.";
    return false;
  }
  return true;
}

var blockhash = function(src, bits, method, callback) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function() {
        var data, contentType, imgData, jpg, png, hash, pixels;

        data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
        contentType = xhr.getResponseHeader('content-type');

        try {
            if (contentType === 'image/png') {
                png = new PNG(data);

                imgData = {
                    width: png.width,
                    height: png.height,
                    data: new Uint8Array(png.width * png.height * 4)
                };

                png.copyToImageData(imgData, png.decodePixels());
            }
            else if (contentType === 'image/jpeg') {
                imgData = jpeg.decode(data);
            }
            else if (contentType === 'image/gif') {
                try {
                    omggif.GifReader(data);
                    pixels = [];
                    omggif.decodeAndBlitFrameRGBA(0,pixels);
                    imgData = {
                            width: omggif.width,
                            height: omggif.height,
                            data: pixels
                    };
                } catch(ex) {
                    imgData = jpeg.decode(data);
                    console.log(ex);
                }

            }

            if (!imgData) {
                throw new Error("Couldn't decode image");
            }

            // TODO: resize if required
            hash = blockhashData(imgData, bits, method);
            callback(null, hash, imgData);
        } catch (err) {
            callback(err, null, null);
        }
    };

    xhr.onerror = function(err) {
        callback(err, null, null);
    };

    xhr.send();
};

module.exports = {
  hammingDistance: hammingDistance,
  blockhash: blockhash,
  blockhashData: blockhashData
}


},{"jpeg-js":"jpeg-js","png-js":"png-js"}]},{},[1])(1)
});