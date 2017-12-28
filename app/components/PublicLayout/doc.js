/* eslint-disable global-require */
import React from 'react';
import { withRouter, browserHistory } from 'react-router'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Button, Checkbox } from 'antd';
import './less/doc.less';
import { getName } from '../common';
import path from 'path';

class Doc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {
  }

  handleCheck =(id, evt ) => {
    this.props.onChecked(id, evt);
  }

  handleChecked = (checkedKeys, evt) => {
    var payload = {
      checked: evt.checked,
      key:evt.node.props.dataRef._id,
    }

    this.props.dispatch({type:'REQ_SET_SHOWABLE_DOC', payload});
  }


  initCtrl =() => {
    var docs = this.props.docs.filter(each => each.table_name == 'Document') || [];
    return docs.map(item => {
      return <li key={item._id} className='custom_set_docs_item'>
        <Checkbox checked={!item.hide} 
          style={{ float:'left'}} 
          onClick={this.handleCheck.bind(this, item._id)}></Checkbox>

        {item.icon && <img style= {{width:18,marginRight:5,float:'left'}}
            src={path.join(process.cwd(), 'assets', item.icon)} />}
        <span>{item.name}</span>
        <span style={{float:'right'}}>{item.version}</span>
      </li>
    })
  }

  render() {
    return (
    <div className="custom_set_docs">
      <ul>
       {this.initCtrl()}
      </ul>
    </div>
    );
  }
}


export default Doc;