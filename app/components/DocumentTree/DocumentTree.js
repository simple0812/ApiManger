import React from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class DocumentTree extends React.Component {
  renderTreeNodes = (data) => {
    return data.map((item) => {
      //第一级
      // if(item.type == 'doc') {
      //   item.children = this.props.treeData.filter(each => each.document_id == item._id);
      // }
      // else {
      //   item.children = this.props.treeData.filter(each => each.parent_id == item._id);
      // }
      if (item.children && item.children.length) {
        return (
          <TreeNode  isLeaf={item.type == 'api'} title={item.name} key={item._id} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode isLeaf={item.type == 'api'} title={item.name} key={item._id} dataRef={item} />;
    });
  }
  render() {
    return (
      <Tree loadData={this.props.onLoadData}>
        {this.renderTreeNodes(this.props.treeData)}
      </Tree>
    );
  }
}
