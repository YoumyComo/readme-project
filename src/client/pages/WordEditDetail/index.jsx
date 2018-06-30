import * as React from 'react';
import {PropTypes} from 'prop-types';
import WrappeForm from './WrappeForm';
import {WordFormContext} from '../../components/Context';



import {  Layout, Breadcrumb, Select, Button,message } from 'antd';
const {  Content } = Layout;



import WordService from '../../services/word';
import BookService from '../../services/book';





export default class WordEditDetail extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            word: '',
            selectedBook: null,
            selectedChapter: null,
            renderChapterList: [],
            translation: [],
            phonetics: '',
            example: [],
            match: '',
            help: '',
            analysis: '',
            imageURL: '',
            audioEngURL: '',
            audioAmeURL: '',
            audioTranslationUpload: null,
            exampleStore:[]
        }
        this.handleBookSelectChange=this.handleBookSelectChange.bind(this)
        this.handleItemChange=this.handleItemChange.bind(this)
        this.updateExampleStore=this.updateExampleStore.bind(this)
    }
    static propTypes = {
        form: PropTypes.object,
    };
    handlerSubmit = async(e) => {
        e.preventDefault() 
        debugger
        this.refs.WrappeForm.validateFields(async(e,value) => {
            if(e){
                console.log(e)
                debugger
                return
            } else {
                const translation = [];
                const transItems = this.refs.WrappeForm.getFieldValue('translationDetailList');
                
                if(transItems){
                    transItems.map(item=>{
                        item ? translation.push(item) : null
                    });
                    this.setState({translation});
                }
                const exampleIndexs = this.refs.WrappeForm.getFieldValue('example');
                const {exampleStore} = this.state;
                if(exampleStore){
                    const example = exampleIndexs.map(i=>exampleStore[i])
                    await this.setState({example});
                }
        
                const{word,selectedBook,selectedChapter, phonetics, imageURL,audioEngURL,audioAmeURL, match, help, analysis, example} = this.state;
        
                const data = {
                            word,
                            imageURL,
                            audioEngURL,
                            audioAmeURL,
                            phonetics,
                            match,
                            help,
                            analysis,
                            translation,
                            example,
                        }
                try {
                    await WordService.postWord(data, selectedBook,selectedChapter)
                    message.success('保存成功')
                } catch(e) {
                    message.error('保存失败:'+e)
                }
            }
        });
       

    }
    handleBookSelectChange = (selectedBook) => {
        const renderChapterList = this.state.bookLists[selectedBook];
        this.refs.WrappeForm.setFieldsValue({selectedChapter: ""});
        this.setState({selectedBook, renderChapterList});
    }
    updateExampleStore = (newExampleStore, index) => {
        let {exampleStore} = this.state;
        console.log('newExampleStore',newExampleStore)
        console.log('index',index)
        console.log('=========')
        exampleStore[index] = Object.assign({}, exampleStore[index], newExampleStore);
            // exampleStore[index] = newExampleStore; 或导致已有信息流失

        console.log(exampleStore[index])

        this.setState({exampleStore})
    }

    handleItemChange  = async(item) => {
        // console.log(item);
         for(let key in item) {
             switch(key)
            {
            case 'word':
            case 'selectedBook':
            case 'selectedChapter':
            case 'phonetics':
            case 'match':
            case 'help':
            case 'analysis':
            case 'imageURL':
            case 'audioAmeURL':
            case 'audioEngURL':
                await this.setState({[key]: item[key]})
                break;
            case 'example':
            case 'translation':
            case 'audioEngUpload':
            case 'audioTranslationUpload':
            default:break 
            }
        }
       
    }
    async componentDidMount() {
        const {selectedBook, word} = this.state;
        const bookLists = await BookService.getBook();    
        const renderChapterList = bookLists[selectedBook];
        if(word){
            const wordInfo = await WordService.getWord(word);
            const {translation, help, match, analysis, example, imageURL,audioEngURL,audioAmeURL,phonetics} = wordInfo;
            this.setState({translation, help, match, analysis, example, imageURL,audioEngURL,audioAmeURL,phonetics})   
            if(example.length) {
               this.setState({ exampleStore: example});
            }
        }
        
        this.setState({renderChapterList, bookLists})   
     }

    async updateWord() {

    }
    componentWillMount() {
        const {bookName, chapterName, spell} = this.props.match.params;
        this.setState({bookName, chapterName});
        const selectedBook = bookName;
        const selectedChapter = chapterName;
        const word = spell ? spell : '';
        this.setState({word, selectedBook, selectedChapter});
    }
    render() {
      if (!this.state.bookLists) return null;
      const { word, selectedBook, selectedChapter, renderChapterList, translation, phonetics, example, match, help, analysis, imageURL, audioEngURL, audioAmeURL,
      audioTranslationUpload, bookLists} = this.state;
      const props = {word, 
                    selectedBook,
                    selectedChapter,
                    renderChapterList, 
                    translation, 
                    phonetics, 
                    example, 
                    match, 
                    help, 
                    analysis, 
                    imageURL, 
                    audioEngURL, 
                    audioAmeURL,
                    audioTranslationUpload,
                    bookLists,
                    handlerSubmit: this.handlerSubmit,
                    handleBookSelectChange: this.handleBookSelectChange,
                    handleItemChange: this.handleItemChange,
                    updateExampleStore: this.updateExampleStore};
        return(
            <div style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item> 编辑单词</Breadcrumb.Item>
                </Breadcrumb>
                <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        <WrappeForm ref ='WrappeForm' {...props} />
                </Content>
            </div> 
        )
    }
}