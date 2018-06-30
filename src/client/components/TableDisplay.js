/*
  word-display页面
  chapter-display页面
  book-display页面
*/ 
import * as React from 'react';
import {Link} from 'react-router-dom';
import { Layout, Breadcrumb, Icon,Table, Divider, Button  } from 'antd';

const {  Content } = Layout;

import {BookContext} from '../../components/Context';

  export default class TableDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: []
        }
       
    }
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
      }
    async componentDidMount() {
    }

    render() {
        const {name, bookName,chapterName,dataSource, title, itemBaseLinkPath, addButtonLinkPath, addButton, addButtonRedirect,handlerOnItemRemoved} = this.props;
        const columns = [{
            title: `${name}`,
            dataIndex: 'name',
            key: 'name',
            render: text => <Link to = {{ pathname: `${itemBaseLinkPath}${bookName?`/${bookName}`:''}${chapterName?`/${chapterName}`:''}/${text.trim()}`}}> {text }</Link>,
          }, {
            title: '',
            dataIndex: '',
          }, {
            title: '',
            dataIndex: '',
          },{
            title: '操作',
            key: 'action',
            render: (text, record) => (
              <span>
                <a onClick={() => {
                 handlerOnItemRemoved(text);
                }}>删除</a>
              </span>
            ),
          }];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            onSelection: this.onSelection,
          };
       // const addPath = title == 'dispalyChapter' ? `${addButtonLinkPath}/${bookName}` : addButtonLinkPath;
       const addPath =  `${addButtonLinkPath}${bookName?`/${bookName}`:''}${chapterName?`/${chapterName}`:''}`;
       
        return(
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                    <Table rowSelection={rowSelection} columns={columns} dataSource={dataSource} />
                    <div className="delet-add-buttons">
                    <Button type="primary">删除所选</Button>
                   
                          <Button type="primary" onClick = {this.handleAddBook} className = "add-book-return-btn">
                              <Link to = {{ pathname: addPath}} > {addButton }</Link>
                          </Button>                
                    </div>
                </Content>
        )
    }
}