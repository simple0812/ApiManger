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

function handleExportData(destDir) {
  var tempOutDir = getPathByCWD('tempdir', uuidv1()) ;
  fse.ensureDirSync(tempOutDir);
  fse.ensureDirSync(getPathByCWD('assets'));
  fse.copySync(getPathByCWD('assets'), path.join(tempOutDir, 'assets'));
  fse.copySync(getPathByCWD('data'), path.join(tempOutDir, 'data'));

  fse.copySync(tempOutDir, path.join(destDir, 'apidata'))
  fse.emptyDirSync(getPathByCWD('tempdir'));
}

function exportData(path) {
  console.log('export data path', path)
  if(!path || path.length == 0) return;

  handleExportData(path[0])
}
export {exportData};
