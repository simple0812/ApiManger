import React from 'react';
import { Tree } from 'antd';
import { ContextMenuTrigger } from 'react-contextmenu';

import _ from 'lodash';
const TreeNode = Tree.TreeNode;

export default class DocumentTree extends React.Component {
  constructor(props) {
    super(props);
  }


  renderTreeNodes = (data, parent) => {
    //let sortNodes = _.sortBy(item.children, each => each.type == 'group'? 0 : 1);
    parent = parent || {};
    if(!parent._id) {
      var cNodes = data.filter(each => each.table_name == 'Document');

      if(cNodes.length == 0) return;
      return cNodes.map((item) => {
        return <TreeNode   
          isLeaf={item.type == 'api'} 
          title={this.wrapperWithMenuTrigger(item)} 
          key={item._id} 

          dataRef={item} >
            {this.renderTreeNodes(data, item)}
        </TreeNode>;
      });
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
          isLeaf={item.type == 'api'} 
          title={this.wrapperWithMenuTrigger(item)} 
          parent = {parent}
          key={item._id} 
          dataRef={item}>
            {this.renderTreeNodes(data, item)}
        </TreeNode>
      );
    });
  }

  wrapperWithMenuTrigger = (item) => (
    <ContextMenuTrigger
      id="PROJECT_MENU"
      onItemClick={this.handleMenuClick}
      onClick={this.handleMenu}
      group={item}
      item={item}
      collect={(props) => (props)}
    >
      {item.showName || item.name}<span style={{ color: '#47494a', float: 'right' }}>{item.version}</span>
    </ContextMenuTrigger>
  );

  handleMenuClick = (e, data) => {
    this.props.onMenuItemClick && this.props.onMenuItemClick(e, data);
  }

  handleMenu = ()=> {
    console.log('xxxxxx');
  }
  render() {
    return (
      <Tree loadData={this.props.onLoadData} 
        onSelect={this.props.onSelect}
      className="project-tree">
        {this.renderTreeNodes(this.props.treeData)}
      </Tree>
    );
  }
}
