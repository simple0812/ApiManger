/* eslint-disable global-require */
import React from 'react';
import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button} from 'antd';
import './less/topnav.less';
import { remote } from 'electron';
import Draggable from 'react-draggable';
import { windowUtil } from '../../server/utils/windowUtil';

class TopNav extends React.Component {
  constructor(props) {
    super(props);
  }

  handleMax = () => {
    var win = remote.getCurrentWindow();
    windowUtil.maxWindow(!win.isMaximized());
  }

  handleClose = () => {
    remote.getCurrentWindow().destroy()
  }

  handleMin = () => {
    windowUtil.minWindow();
  }

  render() {
    return (
    <div className="topnav">
      <div className='navcmd'>
        <Icon className='quit_cmd' type="close" onClick={this.handleClose} ></Icon>
        <Icon className='max_cmd' type="laptop" onClick={this.handleMax}  ></Icon>
        <Icon className='min_cmd' type="minus" onClick={this.handleMin} ></Icon>
      </div>
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}

export default withRouter(connect(mapStateToProps)(TopNav));