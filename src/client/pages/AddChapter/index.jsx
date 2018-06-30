import * as React from 'react';
import {Link} from 'react-router-dom';

import { Layout, Breadcrumb,Table, Button,Form, Input  } from 'antd';
const FormItem = Form.Item;
import BookService from '../../services/book';
const {  Content } = Layout;

import {BookContext} from '../../components/Context';

class ButtonRender extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }
    submit = async (e) => {
        const {bookName,chapterName, updateBooks} = this.props;
        debugger
        if(chapterName) {
            await BookService.createChapter(bookName,chapterName); 
            updateBooks();
        } else {
            alert('请输入新章节')
        }

    }
    render() {
        return(
            <Button type="primary" onClick={this.submit} >创建</Button>
        )
    }
}


export default class AddChapter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookName: null,
            chapterName: null
        };
    }

    onChange = (e) => {
        this.setState({
            chapterName: e.target.value,
        });
    }
    componentDidMount() {
        const {bookName} = this.props.match.params;
        this.setState({ bookName });
    }
    render() {
        const { chapterName,bookName } = this.state;
        if(!bookName) return null;
        return(
            
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>书籍{bookName}---添加章节</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        <Form layout='horizontal'>
                            <FormItem
                                label="章节名称"
                                labelCol = {{ span: 4 }}
                                wrapperCol = {{ span: 14 }}
                                
                            >
                                <Input placeholder="请输入新章节名称" value={chapterName} onChange={this.onChange}/>
                            </FormItem>
                            <FormItem wrapperCol = {{ span: 14, offset: 4 }}>
                                <BookContext.Consumer>
                                    {({books, updateBooks}) => (
                                        <ButtonRender bookName={bookName} updateBooks={updateBooks} chapterName = {chapterName}/>
                                    )}
                                </BookContext.Consumer>
                                <Button type="primary"  >
                                    <Link to = {{ pathname: `/business/display-chapter/${bookName}`}} > 返回</Link>
                                </Button>
                            </FormItem>
                        </Form>
                    </Content>
            </Layout> 
       
            
        )
    }
}