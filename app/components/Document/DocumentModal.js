import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Input, Form, Button, Upload, Icon } from 'antd';
var path = require('path');
var fs = require('fs');
import $ from 'jquery';

const FormItem = Form.Item;

class DocumentModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  uploadProps = {
    name: 'icon',
    // action: '//jsonplaceholder.typicode.com/posts/',
    accept:'.jpg, .png, .jpeg',
    headers: {
      //authorization: 'authorization-text',
    },
    beforeUpload: () => false,
  }

  handleSubmit = (e) => {
    e.preventDefault();  
    this.props.form.validateFieldsAndScroll((err,values)=>{  
      if(!err){  
       this.props.onClose();
        this.props.form.resetFields();//清空提交的表单 
        console.log(values, this.props.doc._id); 
        let src = $('#doc_icon').attr('src');
        if(src) {
          var filename = path.basename(src);
          values.icon = filename;

          var readStream = fs.createReadStream(src);
          var writeStream = fs.createWriteStream(path.join(process.cwd(), 'assets', filename));
          readStream.pipe(writeStream);
        }

        if(this.props.doc._id) {
          values._id = this.props.doc._id;

          this.props.dispatch({type:'REQ_UPDATE_DOC', payload: {...this.props.doc, ...values}});
        } else {

          this.props.dispatch({type:'REQ_CREATE_DOC', payload: values});
        }
      }  
    })  
  } 

  handleSelectIcon = (evt) => {
    if(evt.file.path) {
      $('#doc_icon').attr('src', evt.file.path).show();
    } else {
      $('#doc_icon').attr('src', '').hide();
    }
  }

  render() {
    const { doc } = this.props;
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
          title={doc._id ? '编辑文档' : '创建文档'}
          visible={this.props.visible}
          onOk={this.handleSubmit}
          onCancel={this.props.onClose}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label="从属语言"
              {...formItemLayout}
            >
              {getFieldDecorator('language', {
                rules: [{ required: true, message: '从属语言必须填写' }],
                initialValue:  doc.language || ''
              })(<Input />)}
            </FormItem>
            <FormItem
              label="库名称"
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '库名称必须填写' }],
                initialValue:  doc.name || ''
              })(<Input />)}
            </FormItem>
            <FormItem
              label="库版本"
              {...formItemLayout}
            >
              {getFieldDecorator('version', {
                rules: [{ required: true, message: '库版本必须填写' }],
                initialValue:  doc.version || ''
              })(<Input />)}
            </FormItem>
            <FormItem
              label="图标"
              {...formItemLayout}
            >
              <Upload {...this.uploadProps} onChange={this.handleSelectIcon}>
                <div>
                  <Button>
                    <Icon type="upload" /> Upload
                  </Button>
                  <img src={doc.icon && path.join(process.cwd(), 'assets', doc.icon)} 
                    style={{display: doc.icon? 'inline-block' : 'none'}} id='doc_icon' />
                </div>
              </Upload>
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

// export default Form.create()(DocumentModal);

function mapStateToProps(state) {
  console.log('state===>', state);
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(DocumentModal));

