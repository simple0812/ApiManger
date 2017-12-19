/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../Markdown';
import { Tag } from 'antd';
import './less/detail.less';

class Detail extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    
  }

  getVersionStatus = (status) => {
    if (status === 1) return <a href="javascript:void(0)" onClick={() => { this.handleTagClick({ version_status: status, name: 'Working Draft' }); }}>Working Draft</a>;
    if (status === 2) return <a href="javascript:void(0)" onClick={() => { this.handleTagClick({ version_status: status, name: 'Candidate Recommendation' }); }}>Candidate Recommendation</a>;
    return <a href="javascript:void(0)" onClick={() => { this.handleTagClick({ version_status: status, name: 'Recommendation' }); }}>Recommendation</a>;
  }
  getName = (api, parent) => {
    parent = parent || {};
    if (api.object_type === 1) return `${api.name}()`;
    if (api.object_type === 2) return `${parent.name}.${api.name}()`;
    if (api.object_type === 4) return `${parent.name}.${api.name}`;
    if (api.object_type === 5) return `${api.name}{}`;
    return api.name;
  }
  getStatus = (status) => {
    status = status || 1;
    console.log('status', status);
    if (status === 1) return (<span />);// <img src={require('./images/current.png')} alt="current" />;
    if (status === 2) return <img onClick={() => { this.handleTagClick({ status, name: 'new' }); }} src={require('./images/new.png')} alt="new" />;
    return <img onClick={() => { this.handleTagClick({ status, name: 'deprecated' }); }} src={require('./images/deprecated.png')} alt="deprecated" />;
  }

  handleTagClick = (tag) => {
    //this.props.onSelectTag(tag);
  }

  render() {
    const { api, parent } = this.props;
    if (!api) return (<div />);
    return (
      <div className="api-detail">
        <div className="header label">
          <div className="header-content">
            <span>{api.name}</span>
            <span className="tip">{this.getStatus(api.status)}</span>
          </div>
        </div>
        {api.tags &&
          <div className="tag">
            {api.tags.map(tag => (
              <Tag key={tag.id}>
                <a href="javascript:void(0)" onClick={() => { this.handleTagClick(tag); }}>{tag.name}</a>
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
        <div className="version-status">
          {this.getVersionStatus(api.version_status)}
          <div className="triangle-up" />
        </div>
      </div>
    );
  }
}

export default Detail;