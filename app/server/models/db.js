var Datastore = require('nedb');
var path = require('path');
var Promise = require('bluebird');
/*
  数据库处理逻辑
  1.每个document对应一个db文件 文件名为document_id + '.db', 只保存所有api和分组数据 不包含document数据
  2.data.db为主数据库 保存所有document的数据
*/
var dbCache ={
}

var db = new Datastore({ filename: path.join(process.cwd(), 'data', 'data.db') });
db = Promise.promisifyAll(db);
initDb().then(() => {
  console.log('加载数据库成功');
}).catch(err => {
  console.log('加载数据库失败:' + err.message);
});

async function initDb() {
  var p = await db.loadDatabaseAsync();
  var langs = await db.findAsync({table_name:'Language'});
  if(langs && langs.length) {
    return Promise.resolve();
  }
  var arr = [
    'javascript',
    'csharp',
    'java',
    'python',
    'php',
    'ruby',
    'objectc',
    'c',
    'c++',
    'golang',
    'rust',
    'swift',
  ];
  var lang = {
    table_name: 'Language',
    name: arr.join(' '),
    created_at: ~~(new Date().getTime() / 1000),
    updated_at: ~~(new Date().getTime() / 1000)
  }

  await db.insertAsync(lang);
}

async function connectDb(dbName) {
  if(dbCache[dbName]) return dbCache[dbName];
  var x = new Datastore({ filename: path.join(process.cwd(), 'data', dbName + '.db') });
  var xdb = Promise.promisifyAll(x)
  var a = await xdb.loadDatabaseAsync().catch(err => {
    console.error(`connect db ${dbName} error`, err.message);
    return Promise.resolve();
  });
  //换成数据库连接
  dbCache[dbName] = xdb; 
  return xdb;
}

export default db;
export { connectDb };