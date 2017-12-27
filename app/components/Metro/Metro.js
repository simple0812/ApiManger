import React from 'react';
import PropTypes from 'prop-types';
import './less/metro.less';

class Metro extends React.Component {

  static propTypes = {
  }

  static defaultProps = {

  }

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className='metro-container' style={this.props.style}>
        <div className='metro-topleft'>
          {this.props.topLeft}
        </div>
        <div className='metro-topright'>
          {this.props.topRight}
        </div>
        <div className='metro-bottomleft'>
          {this.props.bottomLeft}
        </div>
        <div className='metro-bottomright'>
          {this.props.bottomRight}
        </div>
        <span className='imgwrapper'>
          {this.props.children}
        </span>
      </div>
    );
  }
}

export default Metro;
