const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter'); // .getNextUniqueId

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, addTodo) => {
  // var id = 
  // items[id] = text;
  // create file with id as file name and text as data

  counter.getNextUniqueId((err, filename) => {
    //debugger
    fs.writeFile(exports.dataDir + `/${filename}.txt`, text, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log(`filename ${filename}.txt was created with ${text}`);
    });
    
    addTodo(null, { filename, text });
  });

  // addTodo(null, { id, text });
};

exports.readAll = (callback) => {
  var data = [];
  _.each(items, (text, id) => {
    data.push({ id, text });
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
