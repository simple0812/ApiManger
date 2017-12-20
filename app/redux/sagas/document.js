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
  // let src = action.payload.icon;
  // if(src) {
  //   var filename = path.basename(src);
  //   fs.copyFileSync(src, path.join(process.cwd(), 'assets', filename));
  //   action.payload.icon = filename;
  // }
  


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

export {getDocs, createDoc, updateDoc}