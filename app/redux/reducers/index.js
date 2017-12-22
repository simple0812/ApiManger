import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { nprogress } from 'redux-nprogress';
import documents from './documents';
import languages from './languages';

const rootReducer = combineReducers({
  routing: routerReducer,
  nprogress,
  documents,
  languages,
});

export default rootReducer;
