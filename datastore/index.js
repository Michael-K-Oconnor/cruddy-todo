const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');

var readFileAsync = Promise.promisify(fs.readFile);
var readdirAsync = Promise.promisify(fs.readdir);
var writeFileAsync = Promise.promisify(fs.writeFile); 

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err,data) => {
    if (err) { 
      throw('Error creating new ID in create'); 
    } else {
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
};

exports.readAll = (callback) => {
  var dirPath = path.join('/Volumes/THAWSPACE/hratx38-cruddy-todo/test/testData/');
  return readdirAsync(dirPath)
    .then((arr) => { 
      let promises = arr.map((fileName) => {
        fileName = fileName.split('.')[0];
        return readOneAsync(fileName);  
      })
      console.log(promises);
      return Promise.all(promises); 
    })
};

exports.readOne = (id, callback) => {
  var currPath = path.join('/Volumes/THAWSPACE/hratx38-cruddy-todo/test/testData/', id + '.txt');
  fs.readFile(currPath, 'utf8', (err, text) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id: id, text: text});
    }
  })
};
var readOneAsync = Promise.promisify(exports.readOne);


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
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
