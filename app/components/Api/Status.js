/* eslint-disable global-require */
import React from 'react';
import PropTypes from 'prop-types';

const Status = ({ status }) => {
  if (status === 1) return (<span />);// <img src={require('./images/current.png')} alt="current" />;
  if (status === 2) return <img src={require('./images/new.png')} alt="new" />;
  return <img src={require('./images/deprecated.png')} alt="deprecated" />;
};

Status.propTypes = {
  status: PropTypes.number.isRequired
};

export default Status;
