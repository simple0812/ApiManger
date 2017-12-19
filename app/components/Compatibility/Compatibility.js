import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import chrome from '../Icon/images/chrome.svg';
import firefox from '../Icon/images/firefox.svg';
import safari from '../Icon/images/safari.svg';
import explorer from '../Icon/images/explorer.svg';
import './less/compatibility.less';

class Compatibility extends React.Component {
  static propTypes = {
    value: PropTypes.shape(),
    onChange: PropTypes.func
  }

  static defaultProps = {
    onChange: () => { }
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      value
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value !== this.props.value) {
      this.setState({ value });
    }
  }

  handleChange = (e) => {
    const value = { ...this.state.value };
    value[e.target.name] = e.target.value;
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const { value } = this.state;
    return (
      <div className="input-group-compatibility">
        <Input name="chrome" value={value.chrome} onChange={this.handleChange} 
          addonBefore={<img style={{width:20, height:20}} src={chrome} />} />
        <Input name="firefox" value={value.firefox} onChange={this.handleChange} 
          addonBefore={<img style={{width:20, height:20}} src={firefox} />} />
        <Input name="safari" value={value.safari} onChange={this.handleChange} 
          addonBefore={<img style={{width:20, height:20}} src={safari} />} />
        <Input name="ie" value={value.ie} onChange={this.handleChange} 
          addonBefore={<img style={{width:20, height:20}} src={explorer} />} />
      </div>
    );
  }
}

export default Compatibility;
