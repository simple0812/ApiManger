import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './less/searchInput.less';
import { Select,Button,AutoComplete  } from 'antd';
import {getName} from '../common';

import _ from 'lodash';
const Option = Select.Option;

class SearchInput extends React.Component {
  static propTypes = {
  }

  static defaultProps = {
  }

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    } 
    this.timeout = null;
  }

  handleChange = (value) => {
    value = value.trim();

    if(value == '') return;

    this.setState({ 
      value:value,
    });

    this.props.dispatch({type:'REQ_SEARCH_APIS', payload:{name:value, keyword:value}});
  }

  handleSelect = (value, opt) => {
    // console.log(opt.props, opt.props.AppId);
  }

  handleFocus =() => {
    this.setState({ 
      value:''
    });
  }

  renderCtrl = () => {
    return this.props.apis.map(d => 
      <Option 
        key={d._id} api={d} 
        value={getName(d, d.parentNode)}>
        {getName(d, d.parentNode)}
      </Option>)
  }

  render() {
    
    return (
      <div>
        <Select
          mode="combobox"
          value={this.state.value}
          placeholder='输入关键字'
          style={{width:180}}
          notFoundContent='搜索结果为空'
          onFocus={this.handleFocus }
          onSelect ={this.props.onSelect}
          onChange={_.throttle(this.handleChange, 500)}>
          {this.renderCtrl()}
        </Select>
      </div>
    );
  }
}

function mapStateToProps(state) {
  var x = state.documents.searchApis || [];
  return { apis: x.splice(0,10) }
}

export default connect(mapStateToProps)(SearchInput);

