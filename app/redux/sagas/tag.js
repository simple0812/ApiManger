import { select, put, call, fork, take, all } from 'redux-saga/effects';
import { Api, Document, Tag } from '../../server/models/';

function* getTags(action) {
  console.log('saga getTags==>', action);
  var p = yield Api.retrieve(action.payload);
  var xAction = {
    type: 'GET_APIS_SUCCESS',
    payload: p
  }

  yield put(xAction);
}

function* updateTags(action) {
  console.log('saga updateTags==>', action);
  var p = yield Api.update({_id:action.payload._id}, action.payload);
  console.log('updateApi', p);
  var xAction = {
    type: 'UPDATE_API_SUCCESS',
    payload: action.payload
  }

  yield put(xAction);
}


export { getTags, updateTags };