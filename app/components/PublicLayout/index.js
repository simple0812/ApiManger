import React from 'react';
import { connect } from 'react-redux';
import { withRouter, browserHistory } from 'react-router'
import { Tree, Icon, Input, message, Upload } from 'antd';
import $ from 'jQuery';
const {remote} = require('electron');
const uuidv1 = require('uuid/v1');
import DocumentTree from '../DocumentTree/DocumentTree';
import NavMenu from '../DocumentTree/NavMenu';
import Detail from '../Api/Detail';
import EditModal from '../Api/EditModal';
import GroupModal from '../Api/GroupModal';
import DocumentModal from '../Document/DocumentModal';
import SearchInput from '../SearchInput/';
import TopNav from './topnav';

import { add, setting as setIcon, about, back, export as exportIcon, save } from '../Icon';
import logo from './images/logo.png'
import styles from './less/main.less';

import Api from '../../server/models/api';
import Document from '../../server/models/document';
import { importData, exportData } from '../../server/utils/';
import {
  Link
} from 'react-router-dom'

const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class Main extends React.Component {
  componentWillMount() {
    this.props.dispatch({type:'REQ_GET_DOCS', payload:{}});
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps===')
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
      expandedKeys:[],
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
      if(this.state.checkable) {
        console.log('handleLoadData not process');

        resolve();
        return;
      }
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

  decideReqGetApisOrNot = (doc) => {
    var children = this.props.docs.filter(each => {
      if(doc.table_name == 'Document') {
        return each.document_id === doc._id;
      } else {
        return each.parent_id === doc._id;
      }
    })

    this.manualExpandTreeNode(doc, true);
    if(children && children.length) {
      return;
    }

    var condition ={};

    if(doc.type == 'group') {
      condition.parent_id = doc._id;
    } else {
      condition = {
        parent_id : 0,
        document_id: doc._id
      }
    } 

    this.props.dispatch({type:'REQ_GET_APIS', payload:condition});
  }

  handleMenuItemClick =(evt, data) => {
    console.log('handleMenuItemClick', data)
    if(!data || !data.item) return;
    switch (data.action) {
    case 'REQ_DEL_ITEM':
      this.props.dispatch({type:'REQ_DEL_ITEM', payload:data.item})
      break;
    case 'EDIT_DOC': 
      if(data.item.table_name == 'Document')
        this.setState({docModalStatus: true, doc: data.item});
      else if(data.item.type == 'api')
        this.setState({apiModalStatus: true, api: data.item, apiParentNode:data.item.parentNode || {}});
      else if(data.item.type == 'group') 
        this.setState({groupModalStatus: true, api: data.item, apiParentNode: data.item.parentNode || {}});
      break;
    case 'ADD_API': 
      this.setState({apiModalStatus: true, api: {}, apiParentNode: data.item});
      this.decideReqGetApisOrNot(data.item);
      break;
    case 'ADD_GROUP': 
      this.setState({groupModalStatus: true,api: {}, apiParentNode: data.item});
      this.decideReqGetApisOrNot(data.item);
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

  manualExpandTreeNode = (doc, isOnlyExpand) => {
    var currId = doc._id;
    var xkeys = [...this.state.expandedKeys];
    if(xkeys.indexOf(currId) == -1) {
      xkeys.push(currId);
    } else if(!isOnlyExpand){
      xkeys = _.without(xkeys, currId);
    }

    this.setState({
      expandedKeys: [...xkeys]
    });
  }

  handleSelectDoc = (key, evt) => {
    console.log('handleSelectDoc', evt.node.props.dataRef);
    if(this.state.checkable) {
      return console.log('handleSelectDoc not process');
    }
    if(!evt.node.props.dataRef || evt.node.props.dataRef.type !== 'api') {
      this.manualExpandTreeNode(evt.node.props.dataRef);
      this.handleLoadData(evt.node).then();
      return;
    }

    this.setState({
      apiModalStatus: false,
      api: evt.node.props.dataRef,
      apiParentNode: evt.node.props.dataRef.parentNode || evt.node.props.parent || {}
    });

    var pt = '/detail/' + evt.node.props.dataRef._id;
    if(pt != this.props.location.pathname)
      this.props.history.push(pt);
    this.props.dispatch({
      type:'SHOW_DETAIL', 
      payload: {
        api: evt.node.props.dataRef,
        parentNode: evt.node.props.dataRef.parentNode || evt.node.props.parent || {}
      }
    })
  }

  //通过关键字搜索的时候 直接跳转到搜索列表 目前弃用
  handleSearchx = (val) => {
    console.log(val)
    if(val.trim().length == 0) return;
    
    this.props.dispatch({type:'REQ_SEARCH_APIS', payload:{name:val, keyword:val}});
    var pt = '/search/' + val;
    if(this.props.location.pathname != pt)
      this.props.history.push(pt)
  }

  handleSearch = (val, opt) => {
    console.log('handleSearch', opt.props.api);
    var api = opt.props.api;
    var pt = '/detail/' + api._id;
    if(pt != this.props.location.pathname)
      this.props.history.push(pt);
    this.props.dispatch({
      type:'SHOW_DETAIL', 
      payload: {
        api: api,
        apiParentNode: api.parentNode
      }
    })
  }

  handleImport = (evt) => {
    console.log('import', evt.file.path);
    importData(evt.file.path);
  }

  customHideDoc = () => {
    this.setState({
      checkable: !this.state.checkable,
      expandedKeys:[]
    })
  }

  handleChecked = (checkedKeys, evt) => {
    var payload = {
      checked: evt.checked,
      key:evt.node.props.dataRef._id,
    }

    this.props.dispatch({type:'REQ_SET_SHOWABLE_DOC', payload});
  }

  handleExpand =(keys, evt) => {
    if(this.state.checkable) {
      return console.log('handleExpand not process');
    }
    console.log('handleExpand', keys, evt)
    //evt.node.props.expanded = true;
    this.setState({
      expandedKeys:[...keys]
    })
  }

  handleExportData = () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }, (path) => {
      exportData(path);
    })
  }

  handleImportData = () => {
    remote.dialog.showOpenDialog({
      properties: ['openFile']
    }, (path) => {
      importData(path).then(() => {
        console.log('import data success')
        this.setState({expandedKeys:[]});
        this.props.dispatch({type:'REQ_GET_DOCS', payload:{}});
      }).catch(err => {
        console.log('import data error:' + err.message)
      });
    })
  }

  render() {
    return (
      <div className='main' style={{paddingTop:20}}>
        <TopNav />
        <div className='siderbar' style={{height:'100%'}}>
          <div className='logo'>
            <img src={ logo } alt="logo" />
          </div>
          <div className='nav'>
            <div className='search'>
              <SearchInput style={{width:180}} onSelect={this.handleSearch}></SearchInput>
            </div>
            <div>
              <DocumentTree treeData={this.props.docs}
                ref='docTree'
                checkedKeys={this.props.checkedKeys}
                expandedKeys={this.state.expandedKeys}
                checkable={this.state.checkable}
                onCheck={this.handleChecked}
                onMenuItemClick={this.handleMenuItemClick}
                onExpand={this.handleExpand}
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
            
            <a href="javascript:void(0)" 
              onClick={this.customHideDoc} 
              title='add document' >
              <Icon style={{fontSize:15}} type={this.state.checkable ? 'pushpin' : 'pushpin-o'}  />
            </a>

            <Link to='/settings' title='setting' >
              <Icon style={{fontSize:15}} type='setting'  />
            </Link>

            <a href="javascript:void(0)" 
              onClick={() =>this.setState({more:!this.state.more}) } 
              title='more' >
              <img src={about} alt='more' style={{color:'white', height:35, width:20}} />
            </a>
          </div>
          {this.state.more &&
            <div className='action' style={{borderTop:'none'}}>
              <a href="javascript:void(0)" onClick= {this.handleExportData}
                title='导出数据' ><Icon style={{fontSize:15}} type='upload'  />
              </a>
              <a href="javascript:void(0)" title='导入数据'  onClick= {this.handleImportData}>
                <Icon style={{fontSize:15}} type='download'  />
              </a>
              <a href="javascript:void(0)" 
                title='' >
              </a>

              <a href="javascript:void(0)" 
                title='' >
              </a>
            </div>
          }
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
  console.log('layout state =>', state)
  var keys = _.chain(state.documents.docs || [])
      .filter(each => each.table_name == 'Document' && !each.hide)
      .map(each => each._id)
      .value();
  return {
    docs: state.documents.docs || [],
    checkedKeys: keys
  }
}

export default withRouter(connect(mapStateToProps)(Main));

