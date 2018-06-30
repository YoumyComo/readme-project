import * as React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import '@client/styles/business.scss';
import BookService from '../../services/book';

import BookDisplay from '../BookDisplay';
import ChapterDisplay from '../ChapterDisplay';
import WordDisplay from '../WordDisplay';
import AddBook from '../AddBook';
import AddChapter from '../AddChapter';
import AddWord from '../AddWord';
import WordEditDetail from '../WordEditDetail';
import WordEditor from '../WordEditor';


import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;


import {BookContext} from '../../components/Context';

function SiderMenv(props) {
    return (
        <Sider width={200} style={{ background: '#fff' }}>
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
            >
                { bookList(props)} 
            </Menu>
        </Sider> 
    );
}
function bookList(props) {
    const { books } = props;        
    let menuLists = [];
    for(let book in books) {           
        menuLists.push(<SubMenu 
                        key={book} 
                        title={<span><Icon type="book" /> <Link to = {{pathname: `/business/display-chapter/${book}`}}>{book}</Link></span>}
                        >
                            {books[book].map(chapter => <Menu.Item key={chapter}>
                                                             <Link to = {{ pathname: `/business/display-word/${book}/${chapter}`}} > {chapter}</Link>
                                                        </Menu.Item>
                            )}
                        </SubMenu>);
    }
    return menuLists;
}
export default class Business extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateBooks: this.updateBooks,
        };
    }

     updateBooks = async() => {
        const books =  await BookService.getBook();
        this.setState({ books });
    }

    async componentDidMount() {
        this.updateBooks();
    }


    render() {
        const { books} = this.state;
        if (!books) return null;
  
        return (
            <Layout>
                <Header className="header">
                <div className="logo" />
                <Link to = {{pathname: '/business'}} className="header-title"><span><Icon type="home"/>  编辑管理</span></Link>
                </Header>
                <Layout>
                    <BookContext.Provider value={this.state}>
                        <BookContext.Consumer >
                            {({books, updateBooks}) =>(<>
                                <SiderMenv books={books}/>
                                <Layout style={{ padding: '0 24px 24px' }}>
                                    <Route exact path="/business" component={(props) => { return <BookDisplay {...props} updateBooks={updateBooks}/> }}/>          
                                    <Route exact path="/business/display-chapter/:bookName" component={(props) => <ChapterDisplay {...props} updateBooks={updateBooks}/>}/>
                                    <Route  path="/business/display-word/:bookName/:chapterName" component={(props) => <WordDisplay {...props} updateBooks={updateBooks}/>}/>  
                                    <Route  path="/business/word-edit-detail/:bookName/:chapterName/:spell" component={WordEditor}/> 
                                    <Route  path="/business/add-word/:bookName/:chapterName" component={(props) => <WordEditor/>}/>  
                                    <Route  path="/business/add-book" component={AddBook}/>  
                                    <Route  path="/business/add-chapter/:bookName" component={AddChapter}/>                                                      
                                </Layout>
                            </>)}
                        </BookContext.Consumer>
                        
                    </BookContext.Provider>
                   
                </Layout>
          </Layout>    
        )
    }

}


// class Route extends React.Component {
//     render() {
//         const props = {
//             match,
//             history,
//         }
//         const Component = this.props.Component;
//         if (location === path) {
//             return <Component {...props}/>
//         }
//     }
// }
