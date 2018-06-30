import * as React from 'react';
import { Layout, Breadcrumb } from 'antd';
import BookService from '../../services/book';
import TabelDisplay from '../../components/TableDisplay';


export default class BookDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        const getbooks =  await BookService.getBook();
        const books = [];
        for (let i in getbooks) {
            books.push({
                key: i,
                name: ` ${i}`,
            });
        }
        this.setState({ books});
    }

    render() {
        const { books } = this.state;
        if (!books) return null
        const gropsProps = {
          title: 'dispalyBooks',
          dataSource: books,
          name: '书名',
          itemBaseLinkPath: '/business/display-chapter',
          addButtonLinkPath: '/business/add-book',
          addButton: '添加书籍',
          addButtonRedirect: '/business',
          handlerOnItemRemoved: async(book) => {
            await BookService.removeBook(book.name.trim());
            this.props.updateBooks();
          },
        }
        return(
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>所有书籍</Breadcrumb.Item>
                </Breadcrumb>
                <TabelDisplay {...gropsProps}/>
            </Layout>
        )
    }
}