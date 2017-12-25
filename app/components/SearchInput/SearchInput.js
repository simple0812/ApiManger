import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './less/searchInput.less';
import { Select,Button  } from 'antd';
import _ from 'lodash';
const Option = Select.Option;

const searchMode = {
  LOCAL:'local',
  SERVER:'server'
}

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

  getName = (api, parent) => {
    parent = parent || {};
    if (api.object_type === 1) return `${api.name}()`;
    if (api.object_type === 2) return `${parent.name}.${api.name}()`;
    if (api.object_type === 4) return `${parent.name}.${api.name}`;
    if (api.object_type === 5) return `${api.name}{}`;
    return api.name;
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

  handleKeyPress =(evt) => {
    console.log('onKeypress')
  }

  handleFocus =() => {
    this.setState({ 
      value:''
    });
  }

  render() {
    const options = this.props.apis.map(d => 
      <Option key={d._id} api={d} value={this.getName(d, d.parentNode)}>{this.getName(d, d.parentNode)}</Option>);
    return (
      <div>
        <Select
          mode="combobox"
          optionLabelProp='children'
          value={this.state.value}
          placeholder='输入关键字'
          notFoundContent=""
          style={this.props.style}
          defaultActiveFirstOption={false}
          showSearch={true}
          showArrow={false}
          onFocus={this.handleFocus }
          filterOption={false}
          onSelect ={this.props.onSelect}
          onChange={_.throttle(this.handleChange, 500)}>
          {options}
        </Select>
      </div>
    );
  }
}

// export default SearchInput;

function mapStateToProps(state) {
  return { apis: (state.documents.searchApis || []).splice(0,10) }
}

export default connect(mapStateToProps)(SearchInput);

