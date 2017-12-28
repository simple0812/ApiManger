import { select, put, call, fork, take, all } from 'redux-saga/effects';
import { Api, Document, Language } from '../../server/models/';

function* getLanguages(action) {
  console.log('saga getLanguages==>', action);
  var p = yield Language.retrieve({});
  if(p && p.length) {
    var xAction = {
      type: 'GET_LANGUAGES_SUCCESS',
      payload: p[0]
    }
    yield put(xAction);
  }
  
}

function* updateLanguages(action) {
  console.log('saga updateLanguages==>', action);
  var p = yield Language.update({_id:action.payload._id}, action.payload);
  console.log('updateApi', p);
  var xAction = {
    type: 'UPDATE_LANGUAGE_SUCCESS',
    payload: action.payload
  }

  yield put(xAction);
}

function* updateSingleLanguage(action) {
  console.log('saga updateSingleLanguage==>', action);
  yield Language.updateSingleLanguagex(action.payload);
  var xAction = {
    type: 'UPDATE_SINGLE_LANGUAGE_SUCCESS',
    payload: action.payload
  }

  yield put(xAction);
}

export { getLanguages, updateLanguages, updateSingleLanguage };