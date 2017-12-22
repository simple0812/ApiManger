import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Input, Form, Button, Row, Col } from 'antd';

const FormItem = Form.Item;

class Language extends React.Component {
 
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();  
    this.props.form.validateFieldsAndScroll((err,values)=>{  
      if(!err){  
        this.props.onClose();
        this.props.form.resetFields();//清空提交的表单 
        console.log(values, this.props); 
        this.props.dispatch({type:'REQ_UPDATE_Language', payload: {...this.props.api, ...values}});
      }  

    });  
  }  

  handleClose = () => {  
    this.props.onClose(); 
  } 
  render() {
    const { lang } = this.props;
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
      <div style={{marginTop:50}}>
          <Form>
            <Row style={{marginBottom:20}}>
                <Col span={6}>
                  <h1 style={{textAlign:'right', color:'white'}}>常用编程语言</h1>
                </Col>
                <Col span={6}>
                </Col>
              </Row>
            <FormItem
              label="编程语言"
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '分组名称必须填写' }],
                initialValue: lang.name || ''
              })(<Input.TextArea autosize={{ minRows: 5, maxRows: 6 }}/>)}
            </FormItem>
            <FormItem>
              <Row style={{marginBottom:60}}>
                <Col span={6}></Col>
                <Col span={6}>
                  <Button className="save" onClick={this.handleSubmit} type="primary">保存</Button>
                </Col>
              </Row>
            </FormItem>
          </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log('group modal state===>', state);
  return {
    lang:state.language || {}
  }
}

export default connect(mapStateToProps)(Form.create()(Language));