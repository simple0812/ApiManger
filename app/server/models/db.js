var Datastore = require('nedb');
var path = require('path');
var Promise = require('bluebird');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
import { remote, ipcRenderer } from 'electron';
/*
  数据库处理逻辑
  1.每个document对应一个db文件 文件名为document_id + '.db', 只保存所有api和分组数据 不包含document数据
  2.data.db为主数据库 保存所有document的数据
*/
const tempDbCache = {};

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

function connectDb(dbName) {
  if(myCache.get(dbName)) {
    console.log(`connect db ${dbName} from cache`)
    return Promise.resolve(myCache.get(dbName));
  } else {
    console.log(`try to connect ${dbName} db`, myCache.get(dbName))
  }

  var x = new Datastore({ filename: path.join(process.cwd(), 'data', dbName + '.db')});

  var xdb = Promise.promisifyAll(x)
  return xdb.loadDatabaseAsync().then(() => {
    myCache.set(dbName, xdb);
    return Promise.resolve(xdb);
  }).catch(err => {
    console.error(`connect db ${dbName} error`, err.message);
    return Promise.resolve();
  });
}

// async function connectDb(dbName) {
//   console.log(`connect ${dbName} db`, dbCache, dbCache[dbName], dbCache.hasOwnProperty(dbName))
//   if(dbCache[dbName]) {
//     return Promise.resolve(dbCache[dbName]);
//   } else {
//     console.log(`try to connect ${dbName} db`, dbCache)
//   }

//   var x = new Datastore({ filename: path.join(process.cwd(), 'data', dbName + '.db') });
//   var xdb = Promise.promisifyAll(x)
//   var a = await xdb.loadDatabaseAsync().catch(err => {
//     console.error(`connect db ${dbName} error`, err.message);
//     return Promise.resolve();
//   });
//   //换成数据库连接
//   dbCache[dbName] = xdb;
//   return xdb;
// }

async function connectTempDb(filename) {
  if(tempDbCache[filename]) return tempDbCache[filename];
  var x = new Datastore({ filename: filename });
  var xdb = Promise.promisifyAll(x)
  var a = await xdb.loadDatabaseAsync().catch(err => {
    console.error(`connect temp db ${filename} error`, err.message);
    return Promise.resolve();
  });
  //换成数据库连接
  tempDbCache[filename] = xdb; 
  return xdb;
}

export default db;
export { connectDb, connectTempDb };