import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { nprogress } from 'redux-nprogress';
import documents from './documents';

const rootReducer = combineReducers({
  routing: routerReducer,
  nprogress,
  documents,
});

export default rootReducer;
