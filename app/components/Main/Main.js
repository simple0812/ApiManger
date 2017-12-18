import React from 'react';
import styles from './less/main.less';
import { Tree, Icon, Input, message } from 'antd';
import logo from './images/logo.png'

import Api from '../../server/models/api';
import Document from '../../server/models/document';
import $ from 'jQuery';

import DocumentTree from '../DocumentTree/DocumentTree';

const TreeNode = Tree.TreeNode;
require('./less/index.css');

class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state ={
      doc:{},
      api:{},
      docs:[],
      apis:[],
      treeData: [
        { title: 'Expand to load', key: '0' },
        { title: 'Expand to load', key: '1' },
        { title: 'Tree Node', key: '2', isLeaf: true },
      ],
    }
  }

  handleDocClick = (key, evt) => {
    console.log(key, evt)
  }

  initTree() {
    return this.state.docs.map(item => {
      return <TreeNode key={item._id} type='doc' title={item.name} ></TreeNode>
    })
  }

  handleSaveDoc =() => {
    if($('#docName').val().trim().length == 0) return;
    var doc = {
      name: $('#docName').val().trim(),
      version: $('#docVersion').val().trim(),
      icon: $('#docIcon').val().trim(),
      language: $('#docLang').val().trim(),
    }

    Document.save({...doc}).then(x => {
        this.setState({doc:{}});
        console.log('save doc success');
    })
  }

  handleDeleteDoc =() => {
    var id = this.state.doc._id;
    if(!id) return;

    Document.remove({_id: id}).then(ret => {
      console.log('delete doc success', ret)
    }).catch(err => {
      console.log(err.message)
    })
  }

  handleUpdateDoc =() => {
    var _id = this.state.doc._id;
    if(!_id) return;

    var doc = {
      name: $('#docName').val().trim(),
      version: $('#docVersion').val().trim(),
      icon: $('#docIcon').val().trim(),
      language: $('#docLang').val().trim(),
    }

    Document.update({_id}, doc).then(ret => {
      console.log('update doc success', ret);
      //this.setState({doc:{}});
    }).catch(err => {
      console.log(err.message)
    })
  }

  selectDoc = (doc) => {
    this.setState({doc})

    $('#docName').val(doc.name);
    $('#docVersion').val(doc.version);
    $('#docLang').val(doc.language);
    $('#docIcon').val(doc.icon);
  }

  handleFindDoc =() => {
    Document.retrieve().then(docs => {
      console.log('find docs', docs)
      this.setState({docs: docs.filter(item => item.name)})
    })
  }

  handleSave =() => {
    if(!this.state.doc._id && this.state.api.type != 'group') {
      return message.error('parent is empty');
    }

    var api = {
      name: $('#apiName').val().trim(),
      type: $('#apiType').val().trim(),
      tags: $('#apiTags').val().trim().split(' ').filter(each => each),
      release_version: $('#apiRelease').val().trim(),
      document_id: this.state.api.document_id || this.state.doc._id,
      parent_id:this.state.api._id || 0
    }

    Api.save(api).then( p => {
      console.log(p)
    }).catch(err => {
      console.log(err.mesage)
    })
  }

  handleDelete =() => {
    var id = this.state.api._id;
    if(!id) return;

    Api.remove({_id: id}).then(ret => {
      console.log('delete api success', ret)
    }).catch(err => {
      console.log(err.message)
    })
  }

  handleUpdate =() => {
    var _id = this.state.api._id;
    if(!_id) return;

    var api = {
      name: $('#apiName').val().trim(),
      type: $('#apiType').val().trim(),
      tags: $('#apiTags').val().trim().split(' ').filter(each => each),
      release_version: $('#apiRelease').val().trim(),
    }

    Api.update({_id}, api).then(ret => {
      console.log('update api success', ret);
    }).catch(err => {
      console.log(err.message)
    })
  }

  handleSelectApi = (api) => {
    console.log('select api', api);
    this.setState({api});

    $('#apiName').val(api.name);
    $('#apiType').val(api.type);
    $('#apiTags').val(api.tags ? api.tags.join(' ') : '' );
    $('#apiRelease').val(api.release_status);
  }

  handleFind =() => {
    Api.retrieve().then(apis => {
      console.log('find apis', apis)
      this.setState({apis: apis.filter(item => item.name)})
    })
  }

  handleTest =() => {
    console.log('aaaa');
  }

  handleLoadData = (treeNode) => {
    return new Promise((resolve) => {
      console.log('treeNode==>', treeNode, treeNode.props.children)
      //如果已经渲染过
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


      Api.retrieve(condition).then( xapis => {
        console.log('xx', condition, xapis)
        treeNode.props.dataRef.children = xapis;

        this.setState({
          docs: [...this.state.docs],
        });
        resolve();
      }).catch(err => {
        console.log('handleLoadData err->', err.message);
        resolve();
      })
    });
  }

  render() {
    return (
      <div className='main'>
        <div className='siderbar'>
          <div className='logo'>
            <img src={ logo } alt="logo" />
          </div>
          <div className='nav'>
            <div className='search'>
            </div>
            <div>
            <DocumentTree treeData={this.state.docs}
              onLoadData ={this.handleLoadData}></DocumentTree>
            </div>
          </div>
          
          <div className='action'>
          </div>
        </div>
        <div className='main-container'>
          <p>文档</p>
          <p>名称:<input type='text' id='docName' /></p>
          <p>版本:<input type='text' id='docVersion' /></p>
          <p>语言:<input type='text' id='docLang' /></p>
          <p>图标:<input type='text' id='docIcon' /></p>
          <div className='action'>
            <a href="javascript:void(0)" title='save' onClick={this.handleSaveDoc.bind(this)}><Icon style={{fontSize:30}} type='save'  /></a>
            <a href="javascript:void(0)" title='find' onClick={this.handleFindDoc.bind(this)}><Icon style={{fontSize:30}} type='bars'  /></a>
            <a href="javascript:void(0)" title='update' onClick={this.handleUpdateDoc.bind(this)}><Icon style={{fontSize:30}} type='edit'  /></a>
            <a href="javascript:void(0)" title='delete' onClick={this.handleDeleteDoc.bind(this)}><Icon style={{fontSize:30}} type='delete'  /></a>
          </div>

          <p>api</p>
          <p>名称:<input type='text' id='apiName' /></p>
          <p>类型:<select id='apiType' defaultValue='api' style={{color:'black'}}>
            <option value='group'>group</option>
            <option value='api'>api</option>
          </select></p>
          <p>标签:<input type='text' id='apiTags' /></p>
          <p>发布状态:<input type='text' id='apiRelease' /></p>
          <div className='action'>
            <a href="javascript:void(0)" title='save' onClick={this.handleSave.bind(this)}><Icon style={{fontSize:30}} type='save'  /></a>
            <a href="javascript:void(0)" title='find' onClick={this.handleFind.bind(this)}><Icon style={{fontSize:30}} type='bars'  /></a>
            <a href="javascript:void(0)" title='update' onClick={this.handleUpdate.bind(this)}><Icon style={{fontSize:30}} type='edit'  /></a>
            <a href="javascript:void(0)" title='delete' onClick={this.handleDelete.bind(this)}><Icon style={{fontSize:30}} type='delete'  /></a>
          </div>
          <div id='docsBox'>
            {
              this.state.docs.map(each => {
                return <p key={each._id} onClick={this.selectDoc.bind(this, each)}>id:{each._id}, name:{each.name},
                  version:{each.version},language:{each.language},icon:{each.icon}
                </p>
              })
            }
          </div>
          <ul id='apisBox' style={{borderTop:'1px solid white'}}>
            {
              this.state.apis.map(each => {
                return <li key={each._id} onClick={this.handleSelectApi.bind(this, each)}>
                  {each.type}, {each.name}, {each.tags && each.tags.map(each => each)}
                </li>
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default Main;
