const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter'); // .getNextUniqueId

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, filename) => {
    fs.writeFile(exports.dataDir + `/${filename}.txt`, text, function(err) {
      if (err) {
        return console.log(err);
      }
      callback(null, { id: filename, text });
    });
  });
};

exports.readAll = (callback) => {

  var data = [];

  fs.readdir(exports.dataDir, (err, files) => {

    _.each(files, file => {

      file = file.slice(0, file.length - 4);
      exports.readOne(file, (err, filedata) => {
        data.push({ id: file, text: filedata });
      });

    });

    callback(null, data);

  });
};

exports.readOne = (id, callback) => {
  fs.readFile(exports.dataDir + `/${id}.txt`, 'utf8', (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text });
    }
  });
};

exports.update = (id, newText, callback) => {
  fs.readFile(exports.dataDir + `/${id}.txt`, 'utf8', (err, oldText) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(exports.dataDir + `/${id}.txt`, newText, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text: newText });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(exports.dataDir + `/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
