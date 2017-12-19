import React from 'react';
import PropTypes from 'prop-types';
import { ContextMenu, MenuItem, connectMenu } from 'react-contextmenu';

class GroupMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    const { id, trigger } = this.props;
    const handleItemClick = trigger ? trigger.onItemClick : null;
    if (trigger && trigger.item && trigger.item.type == 'api') {
      return (
        <ContextMenu id={id}>
          <MenuItem onClick={handleItemClick} data={{ action: 'EDIT_DOC' }}>编辑</MenuItem>
          <MenuItem onClick={handleItemClick} data={{ action: 'REQ_DEL_ITEM'}}>删除</MenuItem>
        </ContextMenu>
      );
    }
    return (
      <ContextMenu id={id}>
        <MenuItem onClick={handleItemClick} data={{ action: 'ADD_API' }}>添加API</MenuItem>
        <MenuItem onClick={handleItemClick} data={{ action: 'ADD_GROUP' }}>添加分组</MenuItem>
        <MenuItem data={{ action: 'EDIT_DOC' }} onClick={handleItemClick}>编辑</MenuItem>
        <MenuItem data={{ action: 'REQ_DEL_ITEM' }} onClick={handleItemClick}>删除</MenuItem>
      </ContextMenu>
    );
  }
};

GroupMenu.propTypes = {
  id: PropTypes.string.isRequired,
  trigger: PropTypes.object
};

export default connectMenu('PROJECT_MENU')(GroupMenu);
