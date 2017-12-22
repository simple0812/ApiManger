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
import { remote, ipcRenderer } from 'electron';

async function handleImportData(tempInDir) {
  var pathname = getPathByCWD(tempInDir, 'data', 'data.db');

  var importDb = Promise.promisifyAll(new Datastore({ filename: pathname }));
  await importDb.loadDatabase();
  // await syncLanguage(importDb);
  // await syncDocs(importDb, tempInDir);
  await syncApiFiles(tempInDir);

  fse.emptyDirSync(tempInDir);
}

//同步languages
async function syncLanguage(importDb) {
  var importLangs = await importDb.findOneAsync({table_name:'Language'});
  var currLangs = await db.findOneAsync({table_name:'Language'});
  importLangs = importLangs || {};
  currLangs = currLangs || {};
  var names = (currLangs.name || '').split(' ').concat((importLangs.name || '').split(' '))
  currLangs.name = _.uniq(names).join(' ');
  await db.updateAsync({_id:currLangs._id}, currLangs, {upsert:true});
}

async function syncDocs(importDb, tempInDir) {
  var importDocs = await importDb.findAsync({table_name:'Document'});
  //return Promise.all(importDocs.map(each => syncDoc(each, tempInDir)));

  return Promise.mapSeries(importDocs, syncDoc);
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
      if(each != '_id' && currApi.hasOwnProperty(key)) {
        currApi[key] = importApi[key];
      }
    }

    await currApiDb.updateAsync({_id: currApi._id}, currApi, {upsert: true});
    console.log('syncApi');
    return Promise.resolve();
  }
}


async function syncDoc(importDoc, tempInDir) {
  var currDoc = await db.findOne({_id: importDoc._id});
  //如果导入的是新的数据 则直接插入
  if(!currDoc) {
    await db.insertAsync(importDoc);
    if(importDoc.icon)
      fse.copySync(path.join(tempInDir, importDoc.icon))
    return Promise.resolve()
  }

  //如果导入的数据与当前数据库冲突，则通过最后更新时间判断是否插入
  if(currDoc.updated_at < importDoc.updated_at) {

    if(currDoc.icon) {
      fse.removeSync(getPathByCWD('assets', currDoc.icon))
    }

    if(importDoc.icon ) {
      fse.copySync(path.join(tempInDir, importDoc.icon))
    }

    for(let key in importDoc) {
      if(each != '_id' && currDoc.hasOwnProperty(key)) {
        currDoc[key] = importDoc[key];
      }
    }

    await db.updateAsync({_id: currDoc._id}, currDoc, {upsert: true});
    return Promise.resolve();
  }
}


function getPathByCWD() {
  return path.join(process.cwd(), ...arguments)
}

function handleExportData(destDir) {
  var tempOutDir = getPathByCWD('tempdir', uuidv1()) ;
  fse.ensureDirSync(tempOutDir);
  fse.copySync(getPathByCWD('assets'), path.join(tempOutDir, 'assets'));
  fse.copySync(getPathByCWD('data'), path.join(tempOutDir, 'data'));

  fse.copySync(tempOutDir, path.join(destDir, 'apidata'))
  fse.emptyDirSync(getPathByCWD('tempdir'));
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

function exportData(path) {
  console.log('export data path', path, remote.getGlobal('2EpLmIwVlwdECN5j'))
  if(!path || path.length == 0) return;

  //handleExportData(path[0])
}

export {getPathByCWD, importData, exportData};