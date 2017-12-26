import _ from 'lodash';

const initialState  = {
  docs :[],
  apis:[],
  searchApis:[],
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
  var xApi = _.find(state.docs, each => each._id == xid) || {};
  var xParent = {};

  if(xApi.parent_id == 0) {
    xParent = _.find(state.doc, each => each._id == xApi.document_id);
  } else {
    xParent =  _.find(state.doc, each => each._id == xApi.parent_id);
  }
  state.api = xApi ;
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
    var x = p.docs.find(each => each._id == action.payload._id);
    if(x) {
      for(var key in action.payload) {
        if(x.hasOwnProperty(key)) {
          x[key] = action.payload[key];
        }
      }
    }
    
    modifySelectedApi(p, action.payload._id);
    return p;
    
  case 'CREATE_API_SUCCESS':
    console.log('CREATE_API_SUCCESS', action.payload);
    var p = {...state};
    action.payload.parentNode = _.find(p.docs, each => {
      if(action.payload.parent_id == 0) 
        return each._id == action.payload.document_id;
      return each._id == action.payload.parent_id;
    }) || {};
    p.docs =[...p.docs, action.payload];
    modifySelectedApi(p, action.payload._id);

    return p;

  case 'UPDATE_DOC_SUCCESS':
    console.log('UPDATE_DOC_SUCCESS', action.payload._id);
    var p = {...state};

    var x = p.docs.find(each => each._id == action.payload._id);
    if(x) {
      for(var key in action.payload) {
        if(x.hasOwnProperty(key)) {
          x[key] = action.payload[key];
        }
      }
    }

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
    var p ={...state, ...action.payload }

    //modifySelectedApi(p, xid);
    return p;

  case 'SEARCH_APIS':
    console.log('SEARCH_APIS', action.payload)
    var p = {...state };
    p.apis = [...action.payload ];

    return p;

  case 'SEARCH_APIS_BY_KEYWORD':
    console.log('SEARCH_APIS_BY_KEYWORD', action.payload)
    var p = {...state };
    p.searchApis = [...action.payload ];
    return {...p};

  case 'SET_SHOWABLE_DOC':
    var p ={...state }

    var x = p.docs.find(each => each._id == action.payload.key);
    if(x) {
      x.hide = !action.payload.checked;
      console.log('SET_SHOWABLE_DOC', p, x.hide)
    }

    return p;
  default:
    return state;
  }
}

export default documents;