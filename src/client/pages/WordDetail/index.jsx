import * as React from 'react';
import ContinueBar from './ContinueBar';
import Word from './Word';
import Detail from './Detail';
import '@client/styles/wordDetail.scss';
import WordService from '../../services/word';


export default class WordDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            word: null,
        };       
    }

    async componentDidMount() {
       const { spell } = this.props.match.params;
       const word = await WordService.getWord(spell);
       this.setState({ word });

    }
   
    render() {
        let { word } = this.state;
        if (!word) return null;
        return (<div className = 'detailContainer'>
            <div className = 'detailWrapper'>
            <Word word={word}></Word>
            <Detail word={word}></Detail>
            </div>
            <ContinueBar word={word}/>
        </div>);
    }
}