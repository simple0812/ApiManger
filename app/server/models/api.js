var db = require('./db');
var BaseModel = require('./baseModel');

/*
{
  table_name:'Api'
  name: { type: String, required: true }, //api名称
  type: { type: Number, required: true }, // 类型 分组或者api
  parent_id: { type: string, required: true }, //层级
  remark:{type: string, required: true, //备注
  status: { type: Number, required: true },
  sort: { type: Number, default: 99, required: true },
  tags: [{ type: string, ref: 'Tag' }],
  release_status: String,
  version_status: { type: Number, required: true },
  refer_to: String,
  compatibility: Object, //浏览器兼容状态
  document_id: { type: string, ref: 'Document' },
}
*/
export default class Api extends BaseModel {
  constructor(obj) {
    super(obj)
  }
}

