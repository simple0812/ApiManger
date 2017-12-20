import _ from 'lodash';

const initialState  = {
  docs :[],
  apis:[]
} 

function delRecursion(state, doc) {
  if(doc.table_name == 'Document') {
    state.docs = _.reject(state.docs, each => each._id == doc._id || each.document_id == doc._id);
  } else {
    state.docs = _.reject(state.docs, each => each._id == doc._id);
    state.docs.filter(each => each.parent_id == doc._id).forEach(each => {
      delRecursion(state, each);
    })
  }
}

function modifySelectedApi(state, xid) {
  var xApi = _.find(state.docs, each => each._id == xid);
  var xParent = {};

  if(xApi.parent_id == 0) {
    xParent = _.find(state.doc, each => each._id == xApi.document_id);
  } else {
    xParent =  _.find(state.doc, each => each._id == xApi.parent_id);
  }
  state.api = xApi || {};
  state.apiPrentNode = xParent || {};
}

function documents(state = initialState, action={}) {
  switch (action.type) {
  case 'GET_DOCES_SUCCESS':
    console.log('GET_DOCES_SUCCESS ==>', state, action.payload)
    var p = {...state};
    p.docs = action.payload;
    return p;

  case 'GET_APIS_SUCCESS':
    console.log('GET_DOCES_SUCCESS ==>', state, action.payload)
    var p = {...state};
    p.docs =[...p.docs, ...action.payload];
    return p;

  case 'UPDATE_API_SUCCESS':
    console.log('UPDATE_API_SUCCESS', action.payload._id);
    var p = {...state};
    p.docs = _.reject(p.docs, each => each._id == action.payload._id);
    p.docs.push(action.payload);
    modifySelectedApi(p, action.payload._id);

    return p;
    
  case 'CREATE_API_SUCCESS':
    console.log('CREATE_API_SUCCESS', action.payload);
    var p = {...state};
    p.docs =[...p.docs, action.payload];
    modifySelectedApi(p, action.payload._id);

    return p;

  case 'UPDATE_DOC_SUCCESS':
    console.log('UPDATE_DOC_SUCCESS', action.payload._id);
    var p = {...state};
    p.docs = _.reject(p.docs, each => each._id == action.payload._id);
    p.docs.push(action.payload);
    return p;
  case 'CREATE_DOC_SUCCESS':
    console.log('CREATE_DOC_SUCCESS', action.payload);
    var p = {...state};
    p.docs =[...p.docs, action.payload];
    return p;

  case 'DEL_ITEM':
    var p = {...state};
    delRecursion(p, action.payload);
    return p;
  case 'SHOW_DETAIL':
    console.log('SHOW_DETAIL')
    var xid = action.payload;
    var p ={...state }
    modifySelectedApi(p, xid);
    return p;

  case 'SEARCH_APIS':
    console.log('SEARCH_APIS', action.payload)
    var p = {...state };
    p.apis = [...action.payload];

    return p;

  default:
    return state;
  }
}

export default documents;