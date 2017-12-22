import React from 'react';
import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Status from './Status';
import './less/search.less';

class Search extends React.Component {
  static propTypes = {
  }

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  handleSelectedApi = (item) => {
    var pt = '/detail/' + item._id;
    if(pt != this.props.location.pathname)
      this.props.history.push(pt);
    this.props.dispatch({
      type:'SHOW_DETAIL', 
      payload: {
        api: item,
        parentNode: item.parentNode
      }
    })
  }

  getDocName = (api) => {
    var p = _.find(this.props.docs, each => each._id == api.document_id);
    return p ? p.name : '';
  }

  getName = (api, parent) => {
    parent = parent || {};
    if (api.object_type === 1) return `${api.name}()`;
    if (api.object_type === 2) return `${parent.name}.${api.name}()`;
    if (api.object_type === 4) return `${parent.name}.${api.name}`;
    if (api.object_type === 5) return `${api.name}{}`;
    return api.name;
  }
  
  render() {
    return (
      <div className="api-search">
        <div className="header">
          搜索纬度:{this.props.match.params.name}
        </div>
        {this.props.apis.map(item => (
          <div key={item._id} className="item">
            <div className="content">
              <a href="javascript:;" onClick={this.handleSelectedApi.bind(this, item)}>
                {this.getName(item, item.parentNode)}
             </a>
              <span className="tip"><Status status={item.status} /></span>
            </div>
            <div className="category">
              {item.path}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

//export default Search;

function mapStateToProps(state) {
  console.log('search state ===>', state)
  return {
    apis: state.documents.apis || [],
    docs: state.documents.docs || []
  }
}

export default withRouter(connect(mapStateToProps)(Search));
