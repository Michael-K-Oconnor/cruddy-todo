const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err,data) => {
    if (err) { 
      throw('Error creating new ID in create'); 
    } else {
      
      // var newPath = path.join(__dirname, data + '.txt' ); 
      var newPath = path.join('/Volumes/THAWSPACE/hratx38-cruddy-todo/test/testData/', data + '.txt')
      fs.writeFile(newPath, text, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          items[data] = data; 
          callback(null, {id: data, text:text});
        }
      });
    }
  });
  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  var dirPath = path.join('/Volumes/THAWSPACE/hratx38-cruddy-todo/test/testData/');
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      throw ('error in readAll');
    } else {
      var todoList = [];
      for (let file of files) {
        fileName = file.split('.')[0]
        todoList.push({ id: fileName, text: fileName });
      }
      callback(null, todoList);
    }
  })
};

exports.readOne = (id, callback) => {
  var currPath = path.join('/Volumes/THAWSPACE/hratx38-cruddy-todo/test/testData/', id + '.txt');
  fs.readFile(currPath, 'utf8', (err, text) => {
    if (err) {
      callback(err);
      // throw ('error in readOne')
    } else {
      let result = {id: id, text: text};
      callback(null, result);
    }
  })




  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  var currPath = path.join('/Volumes/THAWSPACE/hratx38-cruddy-todo/test/testData/', id + '.txt');
  exports.readOne(id, (err)=> { 
    if(err) { 
      callback(err);
    } else { 
      fs.writeFile(currPath, text, 'utf8', (err) => { 
        if (err) { 
          callback(err); 
        } else { 
          callback(null, {id: id, text: text });
        }
      });
    }

  })
  
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
};

exports.delete = (id, callback) => {
  
  var currPath = path.join('/Volumes/THAWSPACE/hratx38-cruddy-todo/test/testData/', id + '.txt');
  
  fs.unlink(currPath, (err) => { 
    if (err) { 
      callback(err); 
    } else { 
      callback(null);
    }
  }); 
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
