import * as React from 'react';
import '@client/styles/wordSpell.scss';
import WordService from '../../services/word';
import Player from '../../components/Player';
import Audio from '../../components/Audio';


export default class WordSpell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            word : null,
            trueAnswer: false,
            list : [],
            timeFlag: false,
        };
        
    }

    clickItem(item) {
        let { list,word} = this.state;
        const wordArr = word.spell.split("");
        if(item ===  wordArr[list.length]) {
            // debugger
            list = list.concat(item);
        }
        this.setState({ list }, ()=>{
            if(this.state.list.length === word.spell.length) {
                // debugger
                this.setState({ trueAnswer: true }); 
            }
        });        
        
    }


    randomSort(arr) {
        arr = arr.slice();
        arr.sort(() =>  Math.random() - Math.random());
        return arr;
    }

    renderListItem() {
        const { list,word} = this.state;
        const wordArr = word.spell.split("");
        return wordArr.map((_,i) => <div key={i} className = "display-item">{list[i] || '_'}</div>);
    }

    clickShow() {
        let { timeFlag } = this.state;
         if(timeFlag) { //如果已经及时则直接返回
             return
         } else { // 如果未计时，则开始计时并将falg设置未true
            timeFlag =  true;
            this.setState({timeFlag});
            setTimeout(()=>{
                timeFlag = false;
                this.setState({timeFlag});
            } ,2000); 
         }      
        return
    }
    showWord() {
        let { timeFlag, word} = this.state;
        if(timeFlag) {
            return word.spell;
        } else {
            return "点我偷看"
        }
        
    }
    
    async componentDidMount() {
        const { spell } = this.props.match.params;
        const word = await WordService.getWord(spell);
        const wordArr = word.spell.split("");
        const wordRandom = this.randomSort(wordArr);
        this.setState({ word, wordArr,wordRandom});
  
     }
    
     render() {
         let { word, wordArr,wordRandom, trueAnswer } = this.state;
         if (!word) return null;
        return (<div className = 'wordSpell'>
                     <div className = "display-word ">
                        <div className = "display-top">
                        {this.renderListItem()}  
                        </div>
                        <div className = "display-bottom">
                            {word.translation}
                        </div>       
                    </div>
                    <div className = "show-word " > 
                        <span onClick={this.clickShow.bind(this)}>
                        {this.showWord()} 
                        </span>
                    </div>  
                    <div className = "segmentation">
                        { wordRandom.map((item, index) => 
                         <div key={index} className = "segmentation-item" onClick={this.clickItem.bind(this, item)}> {item} </div>)
                         }
                         <div className = "clear"></div>  
                    </div>  
                    <div className="word-player">
                        <Player content = {word.spell} trueAnswer={trueAnswer} imgSRC = 'play'/> 
                    </div>                                          
                </div>
                    );
    }
}