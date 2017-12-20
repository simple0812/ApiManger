import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch, withRouter } from 'react-router-dom';
import createHistory from 'history/createHashHistory';
import configureStore from './store/configureStore';
import rootSaga from './redux/sagas/';
import Main from './components/Main';
import Search from './components/Api/Search';
import Detail from './components/Api/Detail';
import EditModal from './components/Api/EditModal';
import {TestMain} from './components/Main';
import PublicLayout from './components/PublicLayout';


const store = configureStore();
store.runSaga(rootSaga);

const history = createHistory();

function RouteWithLayout({layout, component, ...rest}){
  return (
    <Route {...rest} render={(props) =>
      React.createElement( layout, props, React.createElement(component, props))
    }/>
  );
}

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <RouteWithLayout exact  layout={PublicLayout} path="/" component={Main}/>
            <RouteWithLayout exact  layout={PublicLayout} path="/search/:name" component={Search}/>
            <RouteWithLayout exact  layout={PublicLayout} path="/detail/:id" component={Detail}/>
            <RouteWithLayout exact  layout={PublicLayout} path="/api/:action/:id" component={EditModal}/>
          </Switch>
        </Router>
      </Provider>
    );
  }
}
