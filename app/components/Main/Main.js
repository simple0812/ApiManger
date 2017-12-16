import React from 'react';
import styles from './less/main.less';
import { Tree, Icon, Input } from 'antd';
import logo from './images/logo.png'
const Search = Input.Search;
require('./less/index.css');

class Main extends React.Component {
  render() {
    return (
      <div className='main'>
        <div className='siderbar'>
          <div className='logo'>
            <img src={ logo } alt="logo" />
          </div>
          <div className='nav'>
            <div className='search'>
              <Search placeholder='搜索信息' />
            </div>
            <div>
              <Tree>
              </Tree>
            </div>
          </div>
          <div className='action'>
            <a href="javascript:void(0)" title='save'><Icon type='save' /></a>
            <a href="javascript:void(0)" title='export'><Icon type='export'  /></a>
            <a href="javascript:void(0)" title='back'><Icon type='rollback'  /></a>
          </div>
        </div>
        <div className='main-container'>
        </div>
      </div>
    );
  }
}

export default Main;
