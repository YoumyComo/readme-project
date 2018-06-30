import * as React from 'react';
import { Layout, Breadcrumb } from 'antd';
import BookService from '../../services/book';
import TabelDisplay from '../../components/TableDisplay';

export default class ChapterDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    async componentDidMount() {
        const {bookName} = this.props.match.params;
        const getchapters =  await BookService.getChapterBybookName(bookName);
        const chapters=getchapters.map((i)=>{
            return {key: i,
                name: ` ${i}`}
        });
        this.setState({bookName, chapters})
    }

    render() {
        const { bookName,chapters } = this.state;
        if (!bookName) return null
        const gropsProps = {
          bookName: bookName,
          title: 'dispalyChapter',
          dataSource: chapters,
          name: '章节',
          itemBaseLinkPath: '/business/display-word',
          addButtonLinkPath: `/business/add-chapter`,
          addButton: '添加章节',
          addButtonRedirect: '/business',
          handlerOnItemRemoved: async(chapter) => {
            await BookService.removeChapter(bookName,chapter.name.trim());
            this.props.updateBooks();
          },
        }
        return(
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>{bookName}</Breadcrumb.Item>
                </Breadcrumb>
                <TabelDisplay {...gropsProps}/>
            </Layout>
        )
    }
}