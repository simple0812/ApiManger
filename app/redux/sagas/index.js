import { takeLatest, takeEvery, select, put, call, fork, take, all } from 'redux-saga/effects';
import { getDocs, updateDoc, createDoc, setShowableDocs} from './document';
import { getApis, updateApi, createApi, searchApis } from './api';
import { Api, Document } from '../../server/models/';


function* remoteItem(action) {
  if(action.payload && action.payload.table_name == 'Api') {
    yield Api.removeById(action.payload._id, action.payload.document_id);
    yield put({type:'DEL_ITEM', payload:action.payload});
  } else {
    yield Document.removeById(action.payload._id);
    yield put({type:'DEL_ITEM', payload:action.payload});
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest('REQ_GET_DOCS', getDocs),
    takeLatest('REQ_GET_APIS', getApis),
    takeLatest('REQ_DEL_ITEM', remoteItem),
    takeLatest('REQ_UPDATE_API', updateApi),
    takeLatest('REQ_CREATE_API', createApi),

    takeLatest('REQ_UPDATE_DOC', updateDoc),
    takeLatest('REQ_CREATE_DOC', createDoc),
    takeLatest('REQ_SEARCH_APIS', searchApis),
    takeLatest('REQ_SET_SHOWABLE_DOC', setShowableDocs),

    takeLatest('REQ_GET_TAGS', updateDoc),
    takeLatest('REQ_UPDATE_TAGS', createDoc),
  ]);
}
