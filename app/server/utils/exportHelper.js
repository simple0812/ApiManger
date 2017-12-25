var path = require('path');
var fs = require('fs');
const fse = require('fs-extra')
const uuidv1 = require('uuid/v1');
var Datastore = require('nedb');
var path = require('path');
var Api = require('../models/api');
import db, { connectDb, connectTempDb } from '../models/db'
import {getPathByCWD} from './common';
var Promise = require('bluebird');
var _ = require('lodash');

import {zip} from './zipHelper';
async function exportLanguage(exportDb) {
  console.log('exportLanguage.....');
  var expLangs = await db.findOneAsync({table_name:'Language'});
  if(!expLangs) {
    console.log('Language is emtpy');
    return Promise.resolve();
  }

  await exportDb.insertAsync(expLangs);
  console.log('export language success');
}

async function handleExportData(destDir) {
  var tempOutDir = getPathByCWD('tempdir', uuidv1()) ;
  fse.ensureDirSync(tempOutDir);
  fse.ensureDirSync(getPathByCWD('assets'));

  var pathname = path.join(tempOutDir, 'data', 'data.db');
  var x = new Datastore({ filename: pathname});
  var exportDb = Promise.promisifyAll(x);
  await exportDb.loadDatabaseAsync();

  await exportLanguage(exportDb);
  await exportDocs(exportDb, tempOutDir).then(() => {
    console.log('handle export doc success');
  }).catch(err => {
    console.log('handle export doc error', err.message);
  });

  await zip(tempOutDir, path.join(destDir, 'apidata.zip')).then(()=> {
    console.log('export success');
  }).catch(err => {
    console.log(err.message);
  })

  fse.emptyDirSync(getPathByCWD('tempdir'));
}

async function exportDocs(exportDb, tempOutDir) {
  var docs = await db.findAsync({
    table_name:'Document', 
    $or:[{hide:false}, { hide: { $exists: false } }]
  });

  return Promise.mapSeries(docs, exportDoc.bind(null, exportDb, tempOutDir));
}

async function exportDoc(exportDb, tempOutDir, doc) {
  console.log('exportDoc', doc)
  var xdoc = await exportDb.insertAsync(doc);
  console.log('exportDocxx', doc, xdoc)
  var iconUrl = getPathByCWD('assets', doc.icon);
  if(doc.icon && fse.pathExistsSync(iconUrl)) {
      await fse.copy(iconUrl, path.join(tempOutDir, 'assets', doc.icon));
  }

  var apiDbPath = getPathByCWD('data', doc._id + '.db');
  if(fse.pathExistsSync(apiDbPath)) {
    await fse.copy(apiDbPath, path.join(tempOutDir, 'data', doc._id + '.db'));
  }
}

function exportData(path) {
  console.log('export data path', path)
  if(!path || path.length == 0) return;

  return handleExportData(path[0])
}
export {exportData};
