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

  default:
    return state;
  }
}

export default languages;