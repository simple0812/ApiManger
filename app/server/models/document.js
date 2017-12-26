import db, { connectDb } from './db';
var BaseModel = require('./baseModel');
var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
/*
{
  name: { type: String, required: true }, //文档名称
  table_name:'Document',
  language: { type: String, required: true }, //语言
  version: { type: String, required: true },// 版本
  icon: { type: String, required: true },// 小图标
  hide: { type: Boolean, required: true, default: false }, //是否展示
  created_at:{type:Number,}
  updated_at:{type:Number,}
}
*/


export default class Document extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static removeById(id) {
    var p = {_id: id, table_name: this.name}

    return db.findAsync(p).then( docs => {
      docs.forEach(each => {
        console.log('eac', each)
        var pathname = path.join(process.cwd(), 'assets', each.icon || '');

        if(each.icon && fs.existsSync(pathname)) {
          fs.unlinkSync(pathname);
        }
      })

      return db.removeAsync(p).then(ret => {
        var dbPath = path.join(process.cwd(), 'data', id +'.db');
        if(fs.existsSync(dbPath))
          fs.unlinkSync(dbPath);
        
        return Promise.resolve();
      });
    })
  }

  static async getUniqeName(name) {
    var doc = await db.findOneAsync({name, table_name: this.name});
    if(!doc) return Promise.resolve(name);

    return this.getUniqeName(name + '_re');
  }

  static async save(doc) {
    doc.created_at = ~~(new Date().getTime()/1000);
    doc.updated_at = doc.created_at;
    doc.name = await this.getUniqeName(doc.name);
    return db.insertAsync({...doc, table_name: this.name});
  }

  static remove(conditions) {
    conditions = conditions || {};
    var p = {...conditions, table_name: this.name}
    return db.findAsync(p).then( docs => {
      docs.forEach(each => {
        var pathname = path.join(process.cwd(), 'assets', each.icon);
        if(fs.existsSync(pathname)) {
          fs.unlinkSync(pathname);
        }
      })
      return  db.removeAsync(p);
    })
  }
}

