var Datastore = require('nedb');
var path = require('path');
var Promise = require('bluebird');

var db = new Datastore({ filename: path.join(process.cwd(), 'data', 'data.db') });

db.loadDatabase(function (err) {
  if(err) {
    return console.log('加载数据库失败:' + err.message);
  }
  console.log('加载数据库成功');
});

export default Promise.promisifyAll(db);