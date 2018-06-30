import * as React from 'react';
import '@client/styles/sentenceSpell.scss';
import WordService from '../../services/word';
import Player from '../../components/Player';


export default class SetenceSpell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            segmentationRandom: null,
            word: null,
            id: null
        };

    }

    clickItem(item) {
        let { list, word, id} = this.state;
        if (list.length < word.example[id].sentence.split(" ").length) { // 未填满
            list = list.concat(item);
        } 
        this.setState({ list })
    }

    renderListItem() {
        const { list, word, id} = this.state;
        let segmentation = word.example[id].sentence.split(" ");
        if (segmentation.length === list.length) {
            if (segmentation.join(' ') === list.join(' ')) {
                return (<div className = "spell-answer">{list.join(' ')}</div>);
            } else {
                return segmentation.map((s, i) => {
                    const v = list[i];
                    if (s === v) {
                        return <span className = "spell-answer" key = {`answer${i}`} >{s}</span>;
                    } else {
                        return <span className="spell-wrong" key = {`answer${i}`}>{s}</span>;
                    }
                });
            }
        }
        return segmentation.map((_, i) =>
           <div key={i} className = "spell-item">{list[i] || '_'}</div>
        );
    }

    randomSort(arr) {
        arr = arr.slice();
        arr.sort(() =>  Math.random() - Math.random());
        return arr;
    }

    clearItem() {
        let list = [];
        let fall = false;
        this.setState({ list,fall });
    }

    async componentDidMount() {
        const { spell, id } = this.props.match.params;
        const word = await WordService.getWord(spell);
        const segmentationRandom = this.randomSort(word.example[id].sentence.split(" "));
        this.setState({ word, id, segmentationRandom });

    }

    render() {
        let { word,segmentationRandom,id} = this.state;
        if (!segmentationRandom) return null;

        const {translation, setentce} = word.example[id];

        return (<div className = 'sentenceSpell'>
                    <div className = "display">
                        <div className = "display-top">
                            <div  className = 'player-icon'>
                                    <Player content = {word.spell} trueAnswer = {false} imgSRC = 'play'/> {/* content = {word.spell}内容需要修改为setence语音*/}
                            </div>
                            <span className = "sentence">{translation}</span>   
                        </div>
                        <div className = "display-bottom">
                            {this.renderListItem()}
                            <div className="clear"> </div>
                        </div>                     
                    </div>
                    <div className = "sentence-segmentation">
                        { segmentationRandom.map((item, index) => 
                         <div key={index} className = "segmentation-item" onClick={this.clickItem.bind(this, item)}> {item} </div>)
                         }
                         <div className = "clear"></div>  
                    </div>
                    <div className = "button">
                         <div className = "left" onClick={this.clearItem.bind(this)}>Clear</div>
                         <div className = "right">Answer</div> 
                         <div className = "clear"></div>                          
                    </div>
                    <div className = "return">
                         <span className="return-icon"> </span>
                         <span > 返回</span>                         
                    </div>
        </div>);
    }
}