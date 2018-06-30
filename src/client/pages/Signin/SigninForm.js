import * as React from 'react';
import * as crypto from 'crypto';
import '@client/styles/signin.scss';


import WordService from '../../services/word';
import BookService from '../../services/book';
import SigninService from '../../services/singin';

import { Form, Icon, Input, Button, Checkbox, message} from 'antd';
const FormItem = Form.Item;


class SigninForm extends React.Component {
    constructor(props) {
        super(props)
        this.state ={
            username: '',
            password: ''
        }
        this.handlerOnSubmit = this.handlerOnSubmit.bind(this);
        this.handlerOnChange = this.handlerOnChange.bind(this);
    }
    async handlerOnSubmit(e) {
      e.preventDefault() 
      const {username, password} = this.state;
      if(username === '' || password === '') {
          message.error('用户名和密码不能为空');
          return;
      } else {
        try{
          await SigninService.signin(username, password);
          location = '/business';
        } catch (e) {
          if (e.status === 403) {
            message.error('用户名或者密码错误');
          } else {
            message.error('网络异常');
          }
        }
      }
    }

    handlerOnChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    
    render() {
      const { getFieldDecorator } = this.props.form;
      const {username, password} = this.state;
      return (
        <Form onSubmit={this.handlerOnSubmit} className="login-form">
          <FormItem>
            {getFieldDecorator('username', {})(
              <Input  id="username" 
                      name="username"
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>} 
                      placeholder="Username" 
                      onChange = {this.handlerOnChange}
                      value={username}/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
            })(
              <Input id="password" 
                     name="password"
                     prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>} 
                     type="password" 
                     placeholder="Password"
                     onChange = {this.handlerOnChange}
                     value={password} />
            )}
          </FormItem>
          <FormItem className="signin-btn-wrapper">
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住密码</Checkbox>
            )}
            <Button type="primary" htmlType="submit" className="login-form-button">
              登陆
            </Button>
          
          </FormItem>
        </Form>
      );
    }
  }

  export default  Form.create()(SigninForm);