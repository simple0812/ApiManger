import _ from 'lodash';

const initialState  = {
} 

function languages(state = initialState, action={}) {
  switch (action.type) {
  case 'GET_LANGUAGES_SUCCESS':
    console.log('GET_LANGUAGES_SUCCESS ==>', state, action.payload)
    return {...action.payload};

  case 'UPDATE_LANGUAGE_SUCCESS':
    console.log('UPDATE_LANGUAGE_SUCCESS', action.payload._id);
    return {...action.payload};

  case 'UPDATE_SINGLE_LANGUAGE_SUCCESS':
    var p ={...state};
    console.log('UPDATE_SINGLE_LANGUAGE_SUCCESS', p.name, action.payload);
    p.name = p.name.split(' ').filter(each => each);
    if(p.name.indexOf(action.payload) == -1) {
      p.name.push(action.payload);
    }
    p.name = p.name.join(' ');
    
    return {...p};

  default:
    return state;
  }
}

export default languages;