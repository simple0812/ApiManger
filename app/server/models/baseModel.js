var db = require('./db');

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
export default class BaseModel {
  state : {}

  constructor(obj) {
    if(obj) {
        this.payload= {
        ...obj,
        table_name: this.constructor.name
      }  
    }
  }

  saveX = () => {
    return db.insertAsync({...this.state});
  }

  static save(doc) {
    return db.insertAsync({...doc, table_name: this.name});
  }

  static retrieve(conditions) {
    conditions = conditions || {};
    var p = {...conditions, table_name: this.name}
    return db.findAsync(p);
  } 

  static remove(conditions) {
    conditions = conditions || {};
    var p = {...conditions, table_name: this.name}
    return db.removeAsync(p);
  } 

  static update(conditions, model) {
    conditions = conditions || {};
    var p = {...conditions, table_name: this.name}
    return db.updateAsync(p, { $set: model }, {});
  }
}
