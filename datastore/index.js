const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter'); // .getNextUniqueId
const Promise = require('bluebird');

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
  var readOneAsync = Promise.promisify(exports.readOne);

  fs.readdir(exports.dataDir, (err, files) => {
    data = _.map(files, (file) => {
      let id = file.split('.')[0];
      return readOneAsync(id)
        .then(todo => todo)
        .catch(err => console.log('we got an error: ', error));
    });
    Promise.all(data).then((filesData) => callback(null, filesData));  
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
