import * as React from 'react';
import '@client/styles/business.scss';
import BookService from '../../services/book';

export default class BooksDetailList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
        }
    }

    updateRenderBook() {
        // 添加书籍后是否会自动更新？
        const { books } = this.state;
        if(books.length) {
            return books.map((book) =>
                <tr key={book}>
                    <th>{book}</th>
                    <th>b</th>
                    <th>c</th>
                    <th>d</th>                                            
                </tr>
            );
        } else 
            return;

    }

    componentWillReceiveProps() {

    }
    async componentDidMount() {
        const books =  await BookService.getBook();
        this.setState({ books });
    }
    render() {
        return ( 
                <div> 
                    <table  className="table-wrapper">
                        <thead className="table-header">
                            <tr>
                                <th>书籍</th>
                                <th>日期</th>
                                <th>编辑</th>
                                <th>删除</th>                                            
                            </tr>
                        </thead>
                        <tbody>
                            {this.updateRenderBook()}
                        </tbody>
                    </table>                                                 
                </div>   
    )
    }

}