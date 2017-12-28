import React from 'react';
import { Tree } from 'antd';
import { ContextMenuTrigger } from 'react-contextmenu';
import _ from 'lodash';
import { getName } from '../common';
var path = require('path');

const TreeNode = Tree.TreeNode;

export default class DocumentTree extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTreeNodes = (data, parent) => {
    parent = parent || {};
    //渲染第一层menu(document)
    if(!parent._id) {
      var cNodes = data.filter(each => each.table_name == 'Document');
     //如果不在checkable状态 则不显示隐藏项
      if(!this.props.checkable) {
        cNodes = cNodes.filter(each => !each.hide);
      }

      if(cNodes.length == 0) return;
      return cNodes.map((item) => {
        return <TreeNode   
          isLeaf={this.props.checkable} 
          title={this.wrapperWithMenuTrigger(item, parent)} 
          key={item._id} 
          dataRef={item} >
            {this.renderTreeNodes(data, item)}
        </TreeNode>;
      });
    } 

    //在checkable状态下 则不显示子项
    if(this.props.checkable) {
      return;
    }
    
    var cNodes =[]
    if(parent.table_name == 'Document')
      cNodes= data.filter(each => each.parent_id === 0 && each.document_id == parent._id);
    else
      cNodes= data.filter(each => each.parent_id === parent._id);

    if(cNodes.length == 0) return;
    else {
      cNodes = _.sortBy(cNodes, each => each.type == 'group'? 0 : 1);
    }

    return cNodes.map((item) => {
      return (
        <TreeNode onContextMenu={this.handleMenu} 
          disableCheckbox ={true}
          isLeaf={item.type == 'api'} 
          title={this.wrapperWithMenuTrigger(item, parent)} 
          parent = {parent}
          key={item._id} 
          dataRef={item}>
            {this.renderTreeNodes(data, item)}
        </TreeNode>
      );
    });
  }

  wrapperWithMenuTrigger = (item, parent) => (
    <ContextMenuTrigger
      id="PROJECT_MENU"
      onItemClick={this.handleMenuClick}
      onClick={this.handleMenu}
      group={item}
      item={item}
      
      collect={(props) => (props)}
    >
      <div style={{width:'100%', background:'red'}}>
      {item.icon && <img style= {{width:18,marginRight:5,float:'left'}}
        src={path.join(process.cwd(), 'assets', item.icon)} />}
      <span style={{ float:'left'}}>{getName(item, parent)}</span>
      <span style={{ color: '#47494a', float: 'right' }}>{item.version}</span>
      </div>
    </ContextMenuTrigger>
  );

  handleMenuClick = (e, data) => {
    this.props.onMenuItemClick && this.props.onMenuItemClick(e, data);
  }

  handleMenu = ()=> {
  }
  render() {
    return (
      <Tree checkable={this.props.checkable} 
        loadData={this.props.onLoadData} 
        autoExpandParent={false}
        checkedKeys = {this.props.checkedKeys}
        expandedKeys = {this.props.expandedKeys}
        onCheck = {this.props.onCheck}
        onExpand={this.props.onExpand}
        onSelect={this.props.onSelect}
        className="project-tree">
          {this.renderTreeNodes(this.props.treeData)}
      </Tree>
    );
  }
}
