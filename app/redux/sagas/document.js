import { select, put, call, fork, take, all } from 'redux-saga/effects';
import { Api, Document } from '../../server/models/';

function* getDocs(action) {
  console.log('saga getDocs==>', action);
  var p = yield Document.retrieve();
  var xAction = {
    type: 'GET_DOCES_SUCCESS',
    payload: p
  }

  console.log('p', p)
  yield put(xAction);
}

function* createDoc(action) {
  console.log('saga createDoc==>', action);
  var p = yield Document.save(action.payload);
  console.log('createDoc', p);
  var xAction = {
    type: 'CREATE_DOC_SUCCESS',
    payload: p
  }

  yield put(xAction);
}

function* updateDoc(action) {
  console.log('saga updateDoc==>', action);
  var p = yield Document.update({_id: action.payload._id}, action.payload);
  var xAction = {
    type: 'UPDATE_DOC_SUCCESS',
    payload: action.payload
  }

  yield put(xAction);
}

function* setShowableDocs(action) {
  console.log('saga setShowableDocs==>', action);
  var p = yield Document.update(
    {_id: action.payload.key}, 
    { hide: !action.payload.checked});

  var xAction = {
    type: 'SET_SHOWABLE_DOC',
    payload: action.payload
  }

  yield put(xAction);
}

export {getDocs, createDoc, updateDoc, setShowableDocs}