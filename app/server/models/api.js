import db, { connectDb } from './db';
import _ from 'lodash';

import Promise from 'bluebird';

var BaseModel = require('./baseModel');
/*
{
  table_name:'Api'
  name: { type: String, required: true }, //api名称
  type: { type: Number, required: true }, // 类型 分组或者api
  object_type: { type: Number, required: true },//对象类型 原型方法 静态方法 原型属性 静态属性 对象
  parent_id: { type: string, required: true }, //层级
  remark:{type: string, required: true, //备注
  status: { type: Number, required: true }, //API状态 当前 新增 废弃
  sort: { type: Number, default: 99, required: true },
  tags: [{ type: string, }], //标签
  code: { type: string, }, //示例代码
  release_status: String,
  version_status: { type: Number, required: true }, //文档成熟度 工作草案 候选推荐 推荐
  refer_to: String, //参考文献
  compatibility: Object, //浏览器兼容状态
  document_id: { type: string, ref: 'Document' },
  created_at:{type:Number,}
  updated_at:{type:Number,}
}
*/
export default class Api extends BaseModel {
  constructor(obj) {
    super(obj)
  }

  static async removeById(id, doc_id) {
    if(!id || !doc_id) return;
    console.log('removeById', id, doc_id);
    var xdb = await connectDb(doc_id);
    var p = {_id: id, table_name: this.name}
    var ret = await xdb.removeAsync(p);
    var apis = await xdb.findAsync({table_name: 'Api', parent_id: id})
    if(!apis || !apis.length) return Promise.resolve();
    // return Promise.all(apis.map(each => this.removeById.call(this, each._id)));
    return Promise.mapSeries(apis, this.removeById);
  }

  static findAncestors(parentId, ancestors, xdb) {
    ancestors = ancestors || [];
    if(parentId == 0) return ancestors;
    var _this = this;
    return xdb.findOneAsync({_id: parentId, table_name: this.name}).then(api => {

      if(api) {
        ancestors.unshift(api);
        if(api.parent_id == 0) {
          return Promise.resolve(ancestors);
        }

        return _this.findAncestors(api.parent_id, ancestors, xdb);
      } else {
        return Promise.resolve(ancestors);
      }
      
    });
  }

  static async findAncestorsIncludeDoc(api) {
    var doc = await db.findOneAsync({_id: api.document_id, table_name:'Document'});
    if(!doc) doc ={};
    var xdb = await connectDb(doc._id);
    var ancors = [];
    if(api.parent_id) {
      ancors = await this.findAncestors(api.parent_id, ancors, xdb);
    }
    if(!ancors) ancors = [];
    ancors.unshift(doc)
    api.path = ancors.map(each => each.name).join('/');
    api.parentNode = ancors.pop() || {};

    return api;
  }

  static async findInSpecDb(conditions, id) {
    var xdb = await connectDb(id);
    await xdb.loadDatabaseAsync();
    return xdb.findAsync(conditions);
  }

  //1.如果conditions包含document_id 则直接再对应的document文件查找
  //2.如果不包含document_id 则先扫描data.db 或者所有可以显示的document 然后再查找
  static async retrieve(conditions) {
    conditions = conditions || {};
    var p = {...conditions, table_name: this.name}
    var docIds = [];
    if(conditions.document_id) {
      docIds.push(conditions.document_id);
    } else {
      var docs = await db.findAsync({table_name:'Document', $or:[{hide:false}, { hide: { $exists: false } }]});
      docIds = (docs || []).map(each => each._id);
    }

    var xapis = await Promise.map(docIds, this.findInSpecDb.bind(this, p));
    console.log('xapis',xapis);

    var apis = _.flatten(xapis);
    return Promise.map(apis, this.findAncestorsIncludeDoc.bind(this));
  }

  static async update(conditions, model) {
    conditions = conditions || {};
    if(!conditions.document_id) return;
    var xdb = await connectDb(conditions.document_id);

    model.updated_at = ~~(new Date().getTime()/1000);
    var p = {...conditions, table_name: this.name}
    return xdb.updateAsync(p, { $set: model }, {});
  }

  static async save(api) {
    if(!api.document_id) return;
    var xdb = await connectDb(api.document_id);
    api.created_at = ~~(new Date().getTime()/1000);
    api.updated_at = api.created_at;
    return xdb.insertAsync({...api, table_name: this.name});
  }
}

