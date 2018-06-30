import * as React from 'react';
import {Link} from 'react-router-dom';

import { Layout, Breadcrumb,Table, Button,Form, Input  } from 'antd';
const FormItem = Form.Item;
const {  Content } = Layout;
import BookService from '../../services/book';


import {BookContext} from '../../components/Context';

class ButtonRender extends React.Component {
    constructor(props) {
        super(props);
    }
    submit = async (e) => {
        const {bookName, books, updatebooks} = this.props;
        if(bookName) {
            await BookService.createBook(bookName); 
            updatebooks();
        } else {
            alert('请输入新书名')
        }

    }
    render() {
        return(
            <Button type="primary" onClick={this.submit} >创建</Button>
        )
    }
}


export default class AddBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookName: null,
        };
    }

    onChange = (e) => {
        this.setState({
            bookName: e.target.value,
        });
    }

    render() {
        const { bookName } = this.state;
        return(
            
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>添加书籍</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        <Form layout='horizontal'>
                            <FormItem
                                label="书籍名称"
                                labelCol = {{ span: 4 }}
                                wrapperCol = {{ span: 14 }}
                                
                            >
                                <Input placeholder="请输入新书名称" value={bookName} onChange={this.onChange}/>
                            </FormItem>
                            <FormItem wrapperCol = {{ span: 14, offset: 4 }}>
                                <BookContext.Consumer>
                                    {({books, updateBooks}) => (
                                        // <Button type="primary" onClick={this.submit} books={books} updatebooks={updateBooks}>创建</Button>
                                        <ButtonRender books={books} updatebooks={updateBooks} bookName = {bookName}/>
                                    )}
                                </BookContext.Consumer>
                                <Button type="primary"  >
                                    <Link to = {{ pathname: '/business'}} > 返回</Link>
                                </Button>
                            </FormItem>
                        </Form>
                    </Content>
            </Layout> 
       
            
        )
    }
}