import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Input, Form, Button } from 'antd';

const FormItem = Form.Item;

class GroupModal extends React.Component {
 
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();  
    this.props.form.validateFieldsAndScroll((err,values)=>{  
      if(!err){  
        this.props.onClose();
        this.props.form.resetFields();//清空提交的表单 
        console.log(values, this.props.api); 
        values.type = 'group';

        if(this.props.api._id) {
          values._id = this.props.api._id;
          this.props.dispatch({type:'REQ_UPDATE_API', payload: {...this.props.api, ...values}});
        } else {
          if(this.props.parentNode.table_name == 'Document') {
            values.parent_id = 0;
            values.document_id = this.props.parentNode._id;
          } else {
            values.parent_id = this.props.parentNode._id;
            values.document_id = this.props.parentNode.document_id;
          }

          this.props.dispatch({type:'REQ_CREATE_API', payload: values});
        }
      }  
    })  
  }  

  handleClose = () => {  
    this.props.onClose(); 
  } 
  render() {
    const { api } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <Modal
          title={!api._id ? '创建分组' : '编辑分组'}
          visible={this.props.visible}
          onOk={this.handleSubmit}
          onCancel={this.props.onClose}
        >
          <Form>
            <FormItem
              label="分组名称"
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '分组名称必须填写' }],
                initialValue: api.name || ''
              })(<Input />)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('state===>', state);
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(GroupModal));