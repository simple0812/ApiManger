import db, { connectDb } from './db';
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

  static async updateSingleLanguagex(lang) {
    var currLangs = await db.findOneAsync({table_name:'Language'});
    if(!currLangs) {
      return Promise.resolve();
    }
    
    var names = (currLangs.name || '').split(' ').filter(each => each);
    names.push(lang);
    currLangs.name = _.uniq(names).join(' ');
    await db.updateAsync({_id:currLangs._id}, {$set:currLangs});
  }
}

