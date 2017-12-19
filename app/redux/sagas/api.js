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
  var p = yield Api.update({_id:action.payload._id}, action.payload);
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


export { getApis, updateApi, createApi };