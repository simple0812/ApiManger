var path = require('path');
var fs = require('fs');
const fse = require('fs-extra')
const uuidv1 = require('uuid/v1');
var Datastore = require('nedb');
var path = require('path');
var Api = require('../models/api');
import db, { connectDb, connectTempDb } from '../models/db'
var Promise = require('bluebird');
var _ = require('lodash');
import {getPathByCWD} from './common';

async function handleImportData(tempInDir) {
  var pathname = path.join(tempInDir, 'data', 'data.db');
  console.log('handleImportData', pathname);

  var x = new Datastore({ filename: pathname});
  var importDb = Promise.promisifyAll(x)
  await importDb.loadDatabaseAsync();
  await syncLanguage(importDb);
  await syncDocs(importDb, tempInDir).then(() => {
    console.log('syncDocs success')
    return Promise.resolve();
  });
  await syncApiFiles(tempInDir).then(() => {
    console.log('syncApis success')
    return Promise.resolve();
  });

  fse.emptyDirSync(getPathByCWD('tempdir'));
}

//同步languages
async function syncLanguage(importDb) {
  console.log('syncLanguage.....');
  var importLangs = await importDb.findOneAsync({table_name:'Language'});
  if(!importLangs) {
    console.log('Language is emtpy');
    return Promise.resolve();
  }
  var currLangs = await db.findOneAsync({table_name:'Language'});
  console.log('importLangs', importLangs._id, currLangs._id);
  importLangs = importLangs || {};
  currLangs = currLangs || {};
  var names = (currLangs.name || '').split(' ').concat((importLangs.name || '').split(' '))
  currLangs.name = _.uniq(names).join(' ');
  var model = {...currLangs};
  delete model._id;
  await db.updateAsync({_id:currLangs._id}, {$set:model}, {upsert: false});
  console.log('syncLanguage success');
}

async function syncDocs(importDb, tempInDir) {
  console.log('syncDocs.....');
  var importDocs = await importDb.findAsync({table_name:'Document'});
  return Promise.mapSeries(importDocs, syncDoc.bind(null, tempInDir));
}

async function syncDoc(tempInDir, importDoc) {
  var currDoc = await db.findOneAsync({_id: importDoc._id});
  console.log('syncDoc', currDoc, tempInDir);
  //如果导入的是新的数据 则直接插入
  if(!currDoc) {
    await db.insertAsync(importDoc);
    var iconUrl = path.join(tempInDir, 'assets', importDoc.icon);
    if(importDoc.icon && fse.pathExistsSync(iconUrl))
      fse.copySync(iconUrl, getPathByCWD('assets', importDoc.icon))
    return Promise.resolve()
  }

  //如果导入的数据与当前数据库冲突，则通过最后更新时间判断是否插入
  if(currDoc.updated_at < importDoc.updated_at) {

    if(currDoc.icon) {
      fse.removeSync(getPathByCWD('assets', currDoc.icon))
    }

    var iconUrl = path.join(tempInDir, 'assets', importDoc.icon);
    if(importDoc.icon && fse.pathExistsSync(iconUrl)) {
      fse.copySync(path.join(iconUrl), getPathByCWD('assets', importDoc.icon))
    }

    for(let key in importDoc) {
      if(key != '_id' && currDoc.hasOwnProperty(key)) {
        currDoc[key] = importDoc[key];
      }
    }

    await db.updateAsync({_id: currDoc._id}, {$set: currDoc}, {upsert: true});
    return Promise.resolve();
  }
}

async function syncApiFiles(tempInDir) {
  var files = fs.readdirSync(path.join(tempInDir, 'data')) || [];
  files = _.reject(files, each => each == 'data.db');
  console.log('syncApiFiles', files);
  //return Promise.all(files.map(each => syncApiFile(each, tempInDir)))
  return Promise.mapSeries(files, syncApiFile.bind(null, tempInDir));
}

async function syncApiFile(tempInDir, apiDb) {
  //如果apidb文件是新的 则直接移动过去
  if(!fse.pathExistsSync(getPathByCWD('data', apiDb))) {
    await fse.copy(path.join(tempInDir, 'data', apiDb), getPathByCWD('data', apiDb));
    return Promise.resolve();
  }
  console.log('syncApiFile', apiDb);

  await syncApis(apiDb, tempInDir);
  //如果apidb文件已经存在, 则需要合并 遍历每条数据 根据数据的跟新时间判断是否修改
}

async function syncApis(apiDb, tempInDir) {
  var imApiDb = await connectTempDb(path.join(tempInDir, 'data', apiDb));
  var imApis = await imApiDb.findAsync({});
  console.log('syncApis', imApis);
  //return Promise.all(imApis.map(each => syncApi(each, tempInDir)));
  return Promise.mapSeries(imApis, syncApi.bind(null, tempInDir));
}

async function syncApi(tempInDir, importApi) {
  var currApiDb = await connectDb(importApi.document_id);
  var currApi = await currApiDb.findOneAsync({_id: importApi._id});
  //如果导入的是新的数据 则直接插入
  if(!currApi) {
    await currApiDb.insertAsync(importApi);
    return Promise.resolve()
  }

  //如果导入的数据与当前数据库冲突，则通过最后更新时间判断是否插入
  if(currApi.updated_at < importApi.updated_at) {
    for(let key in importApi) {
      if(key != '_id' && currApi.hasOwnProperty(key)) {
        currApi[key] = importApi[key];
      }
    }

    await currApiDb.updateAsync({_id: currApi._id}, currApi, {upsert: true});
    console.log('syncApi');
    return Promise.resolve();
  }
}

async function importData(src) {
  if(!src || src.length == 0) return;
  src = src[0];
  console.log('import data path', src)
  var tempInDir = getPathByCWD('tempdir', uuidv1()) ;
  await fse.ensureDir(tempInDir);
  if(fse.pathExistsSync(path.join(src, 'assets')))
    await fse.copy(path.join(src, 'assets'), path.join(tempInDir, 'assets'));

  if(fse.pathExistsSync(path.join(src, 'data')))
    await fse.copy(path.join(src, 'data'), path.join(tempInDir, 'data'));

  await handleImportData(tempInDir);
}

export {importData};
