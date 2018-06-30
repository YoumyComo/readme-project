import * as React from 'react';
import '@client/styles/detail.scss';
import ImageService from '../../services/image';
import Player from '../../components/Player';
import {Link} from 'react-router-dom';

export default class Detail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
        };  
    }

    async componentDidMount() {
        // const {word} = this.props;
        // const image = await ImageService.getImage(word);
        // this.setState({ image })
     }

    render() {

        const {word} = this.props;
        // 问题4： 可以这样处理吗？
        // let { image } = this.state;
        // if (!image) return null;
        return (
            <div className = "detail">
               <div className = "image-container">
                    <img src={`/api/images/${word.spell}`}/>
               </div>
               <div className = "example">
                    <p>---------------------------- 例句 ----------------------------</p>
                    { word.example.map((t , index)=> (
                        <div className = "example-detail" key={t.sentence}>
                            <div className = 'example-left'>
                                <p className = 'example-sentence'>{t.sentence}</p>
                                <p className = 'example-teanslation'>{t.translation}</p>                    
                            </div>
                            <div className = 'example-right'> 
                                <div  className = 'player-icon'>
                                    <Player content = {word.spell} trueAnswer = {false} imgSRC = 'play'/> {/* content = {word.spell}内容需要修改*/}
                                </div>
                                <Link to={{ pathname: `/sentence_spell/${word.spell}/${index}` }} className="write-link">
                                    <img src="/api/images/pencail" className = 'write-icon'/>
                                </Link> 
                                <div className="clear"> </div>                               
                            </div>
                            <div className="clear"></div>  {/*问题5： 这样清楚浮动影响性能吗*/}
                        </div>
                    ))
                }

               </div>
               <div className = "explain">
                    <p>---------------------------- 详解 ----------------------------</p>
                    <div className = "match" >
                        <span className = 'log-match'>搭 配</span>    
                        <p className = 'detail-match'>{word.match}</p>                        
                        <div className="clear"></div>       
                    </div>
                    <div className = "help-remeber" >
                        <span className = 'log-help'>助 记</span>    
                        <p className = 'detail-help'>{word.help}</p>                        
                        <div className="clear"></div>       
                    </div>
               </div>
            </div>
         )
    }
}
