import * as React from 'react';
import {Link} from 'react-router-dom';
import '@client/styles/listUnit.scss';


export default class ListUnit extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { word, highlight } = this.props;
        return (<Link to = {{
            pathname: `/word_detail/${word.spell}`,
        }} >
            <div className = 'listUnit'>
            <p style={{ color: highlight ? 'red': null }}>{word.spell}</p>
            {word.translation.map(t => <span key={t}>{t}</span>)}
            </div>
        </Link> )
    }
}
