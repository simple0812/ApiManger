/* eslint-disable global-require */
import React from 'react';
import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Markdown from '../Markdown';
import { getName } from '../common';
import { Tag } from 'antd';
import './less/detail.less';

class Detail extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    
  }

  componentWillMount() {
    console.log('componentWillMount', this.props.location);
  }

  componetWillUpdate() {
    console.log('componentWillMount', this.props.location);
  }

  getVersionStatus = (status) => {
    if(!this.props.api._id) return;
    if (status === 1) return <a href="javascript:void(0)" onClick={() => { this.handleTagClick({ version_status: status, name: 'Working Draft' }); }}>Working Draft</a>;
    if (status === 2) return <a href="javascript:void(0)" onClick={() => { this.handleTagClick({ version_status: status, name: 'Candidate Recommendation' }); }}>Candidate Recommendation</a>;
    return <a href="javascript:void(0)" onClick={() => { this.handleTagClick({ version_status: status, name: 'Recommendation' }); }}>Recommendation</a>;
  }
  getStatus = (status) => {
    if(!this.props.api._id) return;
    status = status || 1;
    if (status === 1) return <img onClick={() => { this.handleTagClick({ status, name: 'current' }); }} src={require('./images/current.png')} alt="current" />;
    if (status === 2) return <img onClick={() => { this.handleTagClick({ status, name: 'new' }); }} src={require('./images/new.png')} alt="new" />;
    return <img onClick={() => { this.handleTagClick({ status, name: 'deprecated' }); }} src={require('./images/deprecated.png')} alt="deprecated" />;
  }

  handleTagClick = (tag) => {
    console.log('serch', tag)
    tag.document_id = this.props.api.document_id;
    this.props.dispatch({type:'REQ_SEARCH_APIS', payload:tag});
    this.props.history.push('/search/' + (tag.name || ''))
    //this.props.onSelectTag(tag);
  }

  render() {
    const { api, parent } = this.props;
    if (!api || !api._id || api.type == 'group') return (<div />);
    return (
      <div className="api-detail">
        <div className="header label">
          <div className="header-content">
            <span>{getName(api, parent)}</span>
            <span className="tip">{this.getStatus(api.status)}</span>
          </div>
        </div>
        {api.tags &&
          <div className="tag">
            {api.tags.map( (tag, index) => (
              <Tag key={index}>
                <a href="javascript:void(0)" onClick={() => { this.handleTagClick({name:tag, tag:tag}) }}>{tag}</a>
              </Tag>)
            )}
          </div>
        }
        {api.code &&
          <div className="item">
            <div className="label">使用示例</div>
            <Markdown content={api.code} />
          </div>
        }
        {api.release_status &&
          <div className="item">
            <div className="label">发布状态</div>
            <div className="content">
              {api.release_status}
            </div>
          </div>
        }
        {api.compatibility &&
          <div className="item">
            <div className="label">浏览器兼容性</div>
            <div className="content">
              {Object.keys(api.compatibility).map(item => <span key={item}>{item} {api.compatibility[item]}、</span>)}
            </div>
          </div>
        }
        {api.refer_to &&
          <div className="item">
            <div className="label">参考文献</div>
            <div className="content">
              {api.refer_to}
            </div>
          </div>
        }
        {
          api.version_status &&
          <div className="version-status">
            {this.getVersionStatus(api.version_status)}
            <div className="triangle-up" />
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    docs: state.documents.docs || [],
    api:state.documents.api || {},
    parent:state.documents.apiParentNode || {},
  }
}

export default withRouter(connect(mapStateToProps)(Detail));