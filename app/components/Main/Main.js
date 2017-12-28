import React from 'react';
import { connect } from 'react-redux';

import $ from 'jQuery';

import DocumentTree from '../DocumentTree/DocumentTree';
import NavMenu from '../DocumentTree/NavMenu';
import Detail from '../Api/Detail';
import EditModal from '../Api/EditModal';
import GroupModal from '../Api/GroupModal';
import DocumentModal from '../Document/DocumentModal';

import Api from '../../server/models/api';
import Document from '../../server/models/document';

import styles from './less/main.less';
import logo from './images/logo.png'

class Main extends React.Component {
  componentWillReceiveProps(nextProps) {
  }

  constructor(props) {
    super(props);
    this.state ={
      doc:{},
      api:{},
      parentNode: {},
      apiModalStatus: false,
      docModalStatus: false,
      groupModalStatus: false,
    }
  }

  handleClose = () => {
    this.setState({
      apiModalStatus: false, 
    })
  }


  render() {
    return (
      <div>
        {
          this.state.apiModalStatus 
          ? <EditModal ref='addModal' 
            visible={true} 
            api={this.state.api} 
            parentNode={this.state.parentNode}
            onClose={this.handleClose} /> 
          : <Detail></Detail>
        }
        </div>
    );
  }
}

// export default Main;
function mapStateToProps(state) {
  console.log('main state===>', state);
  return {
    docs: state.documents.docs || []
  }
}

export default connect(mapStateToProps)(Main);
