import * as React from 'react';
import '@client/styles/word.scss';
import Player from '../../components/Player';

export default class Word extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            EngTrueAnswer: false,
            AmeTrueAnswer: true
        }
    }
    render() {
        const { word } = this.props;
        let {EngTrueAnswer, AmeTrueAnswer} = this.state;
        return (
            <div className = "word">
               <span className = "spell">{word.spell}</span>
                <div className = "symbal-player"> 
                    <span className = "symbal">[aeaerr]</span>    
                    <span className="eng-player">
                        <Player content = {word.spell} trueAnswer={EngTrueAnswer} imgSRC = 'Eng'/> {/*英式发音地址 单词-eng*/}
                    </span>   
                    <span className="ame-player">
                        <Player content = {word.spell} trueAnswer={AmeTrueAnswer} imgSRC = 'American'/> {/*美式发音地址 单词-ame*/}
                    </span>  
                    <span className="clear"> </span>              
                </div>
               {word.translation.map(t => (
                   <span className="translation" key={t}>{t}</span>
               ))}
            </div>
         )
    }
}
