import { select, put, call, fork, take, all } from 'redux-saga/effects';
import { Api, Document } from '../../server/models/';

function* getApis(action) {
  console.log('saga getApis==>', action);
  var p = yield Api.retrieve(action.payload);
  var xAction = {
    type: 'GET_APIS_SUCCESS',
    payload: p
  }

  yield put(xAction);
}

function* updateApi(action) {
  console.log('saga updateApi==>', action);
  var condition = {
    _id:action.payload._id, 
    document_id: action.payload.document_id
  };
  var p = yield Api.update(condition, action.payload);
  console.log('updateApi', p);
  var xAction = {
    type: 'UPDATE_API_SUCCESS',
    payload: action.payload
  }

  yield put(xAction);
}

function* createApi(action) {
  console.log('saga createApi==>', action);
  var p = yield Api.save(action.payload);
  console.log('createApi xx', p);

  var xAction = {
    type: 'CREATE_API_SUCCESS',
    payload: p
  }

  yield put(xAction);
}

function* searchApis(action) {
  console.log('saga searchApis==>', action);
  var payload = action.payload;
  var condition = {type: 'api'}; 

  if(payload.hasOwnProperty('status')) {
    condition.status = payload.status
  }

  if(payload.hasOwnProperty('document_id')) {
    condition.document_id = payload.document_id
  }

  if(payload.hasOwnProperty('release_status')) {
    condition.release_status = payload.release_status
  } 

  if(payload.hasOwnProperty('tag')) {
    condition.tags = {$in: [payload.tag]}
  }

  if(payload.hasOwnProperty('version_status')) {
    condition.version_status = payload.version_status
  }

  if(payload.hasOwnProperty('keyword') && payload.keyword) {
    condition.name = {$regex: new RegExp(payload.keyword)}
  }

  var p = yield Api.retrieve(condition);
  var type = payload.hasOwnProperty('keyword') && payload.keyword ? 'SEARCH_APIS_BY_KEYWORD':'SEARCH_APIS';
  var xAction = {
    type: type,
    payload: p
  }

  yield put(xAction);
}


export { getApis, updateApi, createApi, searchApis };