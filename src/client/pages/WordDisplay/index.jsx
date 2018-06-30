import * as React from 'react';
import { Layout, Breadcrumb } from 'antd';
import BookService from '../../services/book';
import TabelDisplay from '../../components/TableDisplay';

export default class WordDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        const {bookName, chapterName} = this.props.match.params;
        const Info =  await BookService.getInfoByBookNameAndChapterName(bookName,chapterName);
        const words=Info.words.map((i)=>{
            return {key: i,
                    name: ` ${i}`}
        });
        this.setState({bookName, chapterName, words})
    }

    render() {
        const { bookName, chapterName,  words} = this.state;
        if (!bookName) return null
        const gropsProps = {
          bookName: bookName,
          chapterName: chapterName,          
          title: 'dispalyWord',
          dataSource: words,
          name: '单词',
          itemBaseLinkPath: '/business/word-edit-detail',
          addButtonLinkPath: `/business/add-word`,
          addButton: '添加单词',
          addButtonRedirect: '/business/display-chapter',
          handlerOnItemRemoved: async(word) => {
            debugger
            await BookService.removeWord(bookName.trim(),chapterName.trim(), word.name.trim());
            this.props.updateBooks();
          },
        }
        return(
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>{bookName}/{chapterName}</Breadcrumb.Item>
                </Breadcrumb>
                <TabelDisplay {...gropsProps}/>
            </Layout>
        )
    }
}