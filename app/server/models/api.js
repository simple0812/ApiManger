var db = require('./db');
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

  static removeById(id) {
    if(!id) return;
    var p = {_id: id, table_name: this.name}
    return db.removeAsync(p).then(ret => {
      return db.findAsync({table_name: 'Api', parent_id: id}).then( apis => {
        if(!apis || !apis.length) return Promise.resolve();
        return Promise.all(apis.map(each => this.removeById.call(this, each._id)));
      })
    });
  }
}

