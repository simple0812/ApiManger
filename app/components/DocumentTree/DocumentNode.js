import React from 'react';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

export default class DocumentNode extends React.Component {
  state = {
    treeData: [
      { title: 'Expand to load', key: '0' },
      { title: 'Expand to load', key: '1' },
      { title: 'Tree Node', key: '2', isLeaf: true },
    ],
  }

  render() {
    return (
      <li class='document-node'>
        <span class='tree-item-head'>{this.props.model.name} {this.props.model.type}</span>
        {this.props.children}
      </li>
    );
  }
}
