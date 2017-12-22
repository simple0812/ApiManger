var db = require('./db');
var BaseModel = require('./baseModel');
/*
{
  table_name:'Language'
  name: { type: String, required: true }, //a
  created_at:{type:Number,}
  updated_at:{type:Number,}
}
*/
export default class Language extends BaseModel {
  constructor(obj) {
    super(obj)
  }
}

