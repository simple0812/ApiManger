var path = require('path');
var fs = require('fs');
const uuidv1 = require('uuid/v1');
var Datastore = require('nedb');
var path = require('path');
var db = require('../models/db');
var Promise = require('bluebird');

function handleImportData(filename) {
  var pathname = path.join(process.cwd(), 'tempdir', filename);

  var xdb = new Datastore({ filename: pathname });
  return new Promise(function(resolve, reject) {
    xdb.loadDatabase(function (err) {
      if(err) {
        return reject(err);
      }
      console.log('加载数据库成功');

      xdb.find({}, (err, docs) => {
        if(err) return reject(err);
        
        Promise.all(docs.map(each => db.updateAsync({_id: each._id}, each, {upsert: true})))
        .then((x) => {
          resolve('导入成功');
        }).catch(err => {
          reject(err);
        })
      })
    });
  })
  
}

function importData(src) {
  var filename = uuidv1() + path.extname(src);

  var readStream = fs.createReadStream(src);
  if(!fs.existsSync(path.join(process.cwd(), 'tempdir')))
    fs.mkdirSync(path.join(process.cwd(), 'tempdir'))

  var writeStream = fs.createWriteStream(path.join(process.cwd(), 'tempdir', filename));
  readStream.pipe(writeStream)

  readStream.on('end', (evt) => {
    handleImportData(filename);
  })
}

export {importData};