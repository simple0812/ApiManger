var db = require('./db');
var BaseModel = require('./baseModel');
var Promise = require('bluebird');
/*
{
  name: { type: String, required: true }, //文档名称
  table_name:'Document',
  language: { type: String, required: true }, //语言
  version: { type: String, required: true },// 版本
  icon: { type: String, required: true },// 小图标
  hide: { type: Boolean, required: true, default: false }, //是否展示
}
*/


export default class Document extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static removeById(id) {
    var p = {_id: id, table_name: this.name}
    return db.removeAsync(p).then(ret => {
      return db.removeAsync({table_name: 'Api', document_id: id});
    });
  } 
}

