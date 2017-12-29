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
      isSearching:true,
    });

    this.props.dispatch({type:'REQ_SEARCH_APIS', payload:{name:value, keyword:value}});
  }

  handleSelect = (value, opt) => {
    // console.log(opt.props, opt.props.AppId);
  }

  handleFocus =() => {
    this.setState({ 
      value:'',
      isSearching:true,
    });
  }

  handleBlur = () => {
    console.log('handleBlur')
    this.setState({ 
      isSearching:false,
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
      <div style={{position:'relative'}}>
        <Select
          mode="combobox"
          value={this.state.value}
          placeholder='输入关键字'
          style={{width:180}}
          notFoundContent='搜索结果为空'
          onFocus={this.handleFocus }
          onBlur={this.handleBlur}
          onSelect ={this.props.onSelect}
          onChange={_.throttle(this.handleChange, 500)}>
          {this.renderCtrl()}
        </Select>
        {this.props.apis.length == 0 && this.state.isSearching && this.state.value &&
        <div style={{width:180,background:'white', position:'absolute', top:30,
          textAlign:'center', zIndex:99, borderRadius:3,
          paddingTop:5,paddingBottom:5}}>
          <span>搜索结果为空</span>
        </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  var x = state.documents.searchApis || [];
  x = _.uniqBy(x, 'name');
  return { apis: x.splice(0,10) }
}

export default connect(mapStateToProps)(SearchInput);

