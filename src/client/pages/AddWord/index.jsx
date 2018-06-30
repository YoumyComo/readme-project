import * as React from 'react';
import WrappeForm from './WrappeForm';
import {WordFormContext} from '../../components/Context';

import {  Layout, Breadcrumb, Select, Button } from 'antd';
const {  Content } = Layout;



import WordService from '../../services/word';
import BookService from '../../services/book';



export default class WordEditDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            word: null,
            audio: {
                Eng: '',
                Ame: ''
            },
            image: '',
            selectedBook: null,
            selectedChapter: null,
            renderChapterList: [],
            translation: '',
            example: [],
            match: '',
            help: '',
            redirectLink: '',
            onSubmitHandler: this.onSubmitHandler,
            handleBookSelectChange: this.handleBookSelectChange,
            updateItem: this.updateItem
            
        }
    }
    onSubmitHandler = async(item) => {
        this.setState({item});
    }
    handleBookSelectChange = (selectedBook) => {
        const renderChapterList = this.state.bookLists[selectedBook];
        this.setState({selectedBook, renderChapterList});
        
    }
    handleChapterSelectChange = (selectedChapter) => {
        
        this.setState({selectedChapter});
    }
     updateItem = (item) => {

    }
    async componentDidMount() {
        const bookLists = await BookService.getBook();
       
        const {bookName, chapterName, word} = this.props.match.params;
        const selectedBook = bookName;
        const selectedChapter = chapterName;
        this.setState({bookLists, bookName, chapterName, word, selectedBook, selectedChapter});
        
     }

    async updateWord() {

    }

    render() {
        return(
            <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item> 编辑单词</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                    <WordFormContext.Provider   value={this.state}>
                        <WrappeForm />
                    </WordFormContext.Provider >
                </Content>
            </Layout> 
        )
    }
}