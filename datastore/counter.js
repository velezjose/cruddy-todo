const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F


const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const writeCounter = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

const readCounter = function(callback) {
  fs.readFile(exports.counterFile, (err, fileData) => {
    if (err) {
      writeCounter(0, callback);
    } else {
      callback(null, Number(fileData));
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (callback) => {  
  readCounter((err, counterString) => {
    let id = parseInt(counterString, 10);
    counterString = zeroPaddedNumber(id + 1);
    writeCounter(id + 1, (err, counterString) => callback(err, counterString));
  });
};

// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');