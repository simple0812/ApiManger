import React from 'react';
import { connect } from 'react-redux';
import { Select, Form, Input, Radio, Button, Modal, Row, Col } from 'antd';
import PropTyeps from 'prop-types';
import Compatibility from '../Compatibility/';

import './less/edit.less';
import 'react-mde/lib/styles/css/react-mde-all.css';
import 'font-awesome/css/font-awesome.min.css';
import $ from 'jquery';

import ReactMde, { ReactMdeCommands } from 'react-mde';

function setCursorPosition(elem, index) {
    var val = elem.value
    var len = val.length
 
    // 超过文本长度直接返回
    if (len < index) return
    setTimeout(function() {
        elem.focus()
        if (elem.setSelectionRange) { // 标准浏览器
            elem.setSelectionRange(index, index)   
        } else { // IE9-
            var range = elem.createTextRange()
            range.moveStart("character", -len)
            range.moveEnd("character", -len)
            range.moveStart("character", index)
            range.moveEnd("character", 0)
            range.select()
        }
    }, 10)
}

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const { Option } = Select;

class EditModal extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);

    $('#mde-text').on('textarea', 'blur', function() {
      console.log('blur...')
    })
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
  }

  handleSubmit = (e) => {
    e.preventDefault();  
    this.props.form.validateFieldsAndScroll((err,values)=>{  
      console.log('handleSubmit', values)
      if(!err){  
        this.props.onClose();
        this.props.form.resetFields();//清空提交的表单 
        console.log(values, this.props.api); 
        values.type = 'api';
        values.tags = values.tags.split(' ').filter(each => each);
        values.code = values.code.text || '';
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

  handleChange =(evt)=> {
    // console.log('x', $('#mdEditorArea').get(0).selectionEnd, $('#mdEditorArea').get(0).selectionStart)
    // if(evt.text.slice(-1) == ' ') {
    //   console.log('true');
    // } else {
    //   setTimeout(function() {
    //     $('#mdEditorArea').val(evt.text + '')
    //     setCursorPosition($('#mdEditorArea').get(0), evt.text.length+1)
    //   },0)
    // }
  }

  normFile = (e) => {
    return e;
    //return e.text;
  }

  textAreaProps ={
    id:'mdEditorArea',
    onBlur: function(evt) {
    },
    onFocus: function(evt) {
    },
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const { status, api, parentNode } = this.props;

    return (
      <div className="api-edit">
          <Form>
            <FormItem
              className="title"
              label={this.props.api._id ? '编辑Api': '添加Api'}
              colon={false}
              {...formItemLayout}
            />
            <FormItem
              label="API名称"
              {...formItemLayout}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'API名称必须填写' }],
                initialValue: api.name
              })(<Input />)}
            </FormItem>
            
            <FormItem
              label="API类型"
              {...formItemLayout}
            >
              {getFieldDecorator('object_type', {
                rules: [{ required: true, message: 'API类型必须填写' }],
                initialValue:  api.object_type || 1
              })(
                <RadioGroup>
                  <Radio value={1}>原型方法</Radio>
                  <Radio value={2}>静态方法</Radio>
                  <Radio value={3}>原型属性</Radio>
                  <Radio value={4}>静态属性</Radio>
                  <Radio value={5}>对象</Radio>
                </RadioGroup>)}
            </FormItem>

            {parentNode.table_name == 'Api' && parentNode.group_type == 'collection' &&
            (this.props.form.getFieldsValue().object_type == 2 
              || this.props.form.getFieldsValue().object_type == 4) &&
            <FormItem
              label="API类型名称"
              {...formItemLayout}
            >
              {getFieldDecorator('class_name', {
                rules: [{ required: true, message: 'API类型名称必须填写' }],
                initialValue: api.class_name || ''
              })(<Input />)}
            </FormItem>
            }
            <FormItem
              label="Tags"
              {...formItemLayout}
            >
              {getFieldDecorator('tags', {
                initialValue: (api.tags || []).join(' ')
              })(<Input />)}
            </FormItem>
            <FormItem
              label="API状态"
              {...formItemLayout}
            >
              {getFieldDecorator('status', {
                rules: [{ required: true, message: '库版本必须填写' }],
                initialValue:  api.status || 1
              })(<RadioGroup>
                <Radio value={1}>当前(current)</Radio>
                <Radio value={2}>新增(new)</Radio>
                <Radio value={3}>废弃(deprecated)</Radio>
              </RadioGroup>)}
            </FormItem>
            <FormItem
              label="用法"
              {...formItemLayout}
            >
              {getFieldDecorator('code', {
                getValueFromEvent: this.normFile,
                initialValue:  {text: api.code || ''},
                rules: [{
                  validator:(rule, value, cb) => {
                  return cb();} 
                }],
              })(<ReactMde
                    visibility={{preview:false}}
                    textAreaProps={this.textAreaProps}
                    onChange={this.handleChange}
                    commands={ReactMdeCommands.getDefaultCommands()}
                />)}
            </FormItem>

            <FormItem
              label="文档成熟度"
              {...formItemLayout}
            >
              {getFieldDecorator('version_status', {
                rules: [{ required: true, message: '文档成熟度必须填写' }],
                initialValue: api.version_status || 1
              })(
                <RadioGroup>
                  <Radio style={radioStyle} value={1}>工作草案(WD，Working Draft)</Radio>
                  <Radio style={radioStyle} value={2}>候选推荐(CR，Candidate Recommendation)</Radio>
                  <Radio style={radioStyle} value={3}>推荐(REC，Recommendation)</Radio>
                </RadioGroup>)}
            </FormItem>
            <FormItem
              label="发布状态"
              {...formItemLayout}
            >
              {getFieldDecorator('release_status', {
                initialValue:  api.release_status || ''
              })(<Input />)}
            </FormItem>
            <FormItem
              label="兼容性"
              {...formItemLayout}
            >
              {getFieldDecorator('compatibility', {
                initialValue:  api.compatibility || {
                  chrome: 'latest',
                  firefox: 'latest',
                  safari: 'latest',
                  ie: '9+',
                }
              })(<Compatibility />)}
            </FormItem>
            <FormItem
              label="参考文献"
              {...formItemLayout}
            >
              {getFieldDecorator('refer_to', {
                initialValue:  api.refer_to || ''
              })(<TextArea rows={8} />)}
            </FormItem>

            <FormItem
              label=" "
              colon={false}
              {...formItemLayout}
            >
            </FormItem>

            <Row style={{marginBottom:60}}>
              <Col span={4}></Col>
              <Col span={6}>
                <Button className="save" onClick={this.handleSubmit} type="primary">保存</Button>
                <Button className="cancel" onClick={this.props.onClose}>取消</Button>
              </Col>
            </Row>
          </Form>
      </div>
    );
  }
}

// export default Form.create()(EditModal);
function mapStateToProps(state) {
  console.log('editmodel state===>', state);
  return {
  }
}

export default connect(mapStateToProps)(Form.create()(EditModal));

