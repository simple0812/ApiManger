import React from 'react';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router'
import styles from './less/main.less';
import { Tree, Icon, Input, message, Upload } from 'antd';
import logo from './images/logo.png'

import Api from '../../server/models/api';
import Document from '../../server/models/document';
import $ from 'jQuery';

import DocumentTree from '../DocumentTree/DocumentTree';
import NavMenu from '../DocumentTree/NavMenu';
import Detail from '../Api/Detail';
import EditModal from '../Api/EditModal';
import GroupModal from '../Api/GroupModal';
import DocumentModal from '../Document/DocumentModal';
import LeftNav from '../DocumentTree/LeftNav';

import { importData } from '../../server/utils/common';
const uuidv1 = require('uuid/v1');




const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class Main extends React.Component {

  componentWillMount() {
    this.props.dispatch({type:'REQ_GET_DOCS', payload:{}});
  }

  componentWillReceiveProps(nextProps) {
    var currApi = this.state.api || {};
    let nextApi = nextProps.docs.find(each => each._id == this.state.api._id);
    this.setState({
      api: nextApi || {}
    })
  }

  constructor(props) {
    super(props);
    this.state ={
      doc:{},
      api:{},
      apiParentNode: {},
      apiModalStatus: false,
      docModalStatus: false,
      groupModalStatus: false,
    }
  }

  uploadProps = {
    name: 'icon',
    // action: '//jsonplaceholder.typicode.com/posts/',
    accept:'.db',
    headers: {
      //authorization: 'authorization-text',
    },
    beforeUpload: () => false,
  }

  //加载左侧导航数据
  handleLoadData = (treeNode) => {
    return new Promise((resolve) => {
      //如果已经渲染过 (这样有bug 如果开始就有数据但没展开 然后动态添加数据后 原来的数据旧无法展开了)
      if (treeNode.props && treeNode.props.children && treeNode.props.children.length) {
        resolve();
        return;
      }

      //如果是叶子节点
      if (treeNode.props 
        && treeNode.props.dataRef 
        && treeNode.props.dataRef.type == 'api') {
        resolve();
        return;
      }

      var condition ={};

      if(treeNode.props.dataRef.type == 'group') {
        condition.parent_id = treeNode.props.dataRef._id;
      } else {
        condition = {
          parent_id : 0,
          document_id: treeNode.props.dataRef._id
        }
      } 

      this.props.dispatch({type:'REQ_GET_APIS', payload:condition});
      resolve();
    });
  }



  handleMenuItemClick =(evt, data) => {
    console.log(data);
    if(!data || !data.item) return;
    switch (data.action) {
    case 'REQ_DEL_ITEM':
      this.props.dispatch({type:'REQ_DEL_ITEM', payload:data.item})
      break;
    case 'EDIT_DOC': 
      if(data.item.table_name == 'Document')
        this.setState({docModalStatus: true, doc: data.item});
      else if(data.item.type == 'api')
        this.setState({apiModalStatus: true, api: data.item, apiParentNode:{}});
      else if(data.item.type == 'group') 
        this.setState({groupModalStatus: true, api: data.item, apiParentNode:{}});
      break;
    case 'ADD_API': 
      this.setState({apiModalStatus: true, api: {}, apiParentNode: data.item});
      break;
    case 'ADD_GROUP': 
      this.setState({groupModalStatus: true,api: {}, apiParentNode: data.item});
      break;
    default: break;
    }
  }

  handleClose = () => {
    this.setState({
      apiModalStatus: false, 
      // apiParentNode: {},
    })
  }
  handleDocClose = () => {
    this.setState({
      docModalStatus: false, 
      // doc: {},
    })
  }

  handleGroupClose = () => {
    this.setState({
      groupModalStatus: false, 
      // doc: {},
    })
  }

  handleSelectDoc = (key, evt) => {
    console.log('handleSelectDoc', evt.node.props);
    if(!evt.node.props.dataRef || evt.node.props.dataRef.type !== 'api') return; 
    this.setState({
      apiModalStatus: false,
      api: evt.node.props.dataRef,
      apiParentNode: evt.node.props.parent || {}
    });

    var pt = '/detail/' + evt.node.props.dataRef._id;
    if(pt != this.props.location.pathname)
      this.props.history.push(pt);
    this.props.dispatch({
      type:'SHOW_DETAIL', 
      payload: evt.node.props.dataRef._id
    })
  }
  handleSearch = (val) => {
    console.log(val)
    if(val.trim().length == 0) return;
    
    this.props.dispatch({type:'REQ_SEARCH_APIS', payload:{name:val, keyword:val}});
    var pt = '/search/' + val;
    if(this.props.location.pathname != pt)
      this.props.history.push(pt)
  }

  handleImport = (evt) => {
    console.log('import', evt.file.path);
    importData(evt.file.path);
  }


  render() {
    return (
      <div className='main'>
        <div className='siderbar' style={{height:'100%'}}>
          <div className='logo'>
            <img src={ logo } alt="logo" />
          </div>
          <div className='nav'>
            <div className='search'>
              <Search
                placeholder="input search text"
                onSearch={this.handleSearch}
              />
            </div>
            <div>
              <DocumentTree treeData={this.props.docs}
                onMenuItemClick={this.handleMenuItemClick}
                onSelect={this.handleSelectDoc}
                onLoadData={this.handleLoadData}>
              </DocumentTree>
              <NavMenu></NavMenu>
            </div>
          </div>
          
          <div className='action'>
            <a href="javascript:void(0)" 
              onClick={() => {this.setState({docModalStatus:true, doc:{}})}} 
              title='add document' ><Icon style={{fontSize:15}} type='plus'  />
            </a>
            <a href="javascript:void(0)" title='import data' >
              <Upload {...this.uploadProps} onChange={this.handleImport}>
                <Icon style={{fontSize:15}} type='download'  />
              </Upload>
            </a>
          </div>
        </div>
        <DocumentModal 
          doc={this.state.doc} 
          onClose={this.handleDocClose}
          visible={this.state.docModalStatus}>
        </DocumentModal>
        <GroupModal 
          api={this.state.api} 
          parentNode={this.state.apiParentNode}
          onClose={this.handleGroupClose}
          visible={this.state.groupModalStatus}>
        </GroupModal>
        <div className='main-container'>
          {
            this.state.apiModalStatus 
            ? <EditModal ref='addModal' 
              visible={true} 
              api={this.state.api} 
              parentNode={this.state.apiParentNode}
              onClose={this.handleClose} /> 
            : this.props.children
          }
        </div>
        
      </div>
    );
  }
}

// export default Main;
function mapStateToProps(state) {
  return {
    docs: state.documents.docs || []
  }
}

export default withRouter(connect(mapStateToProps)(Main));

