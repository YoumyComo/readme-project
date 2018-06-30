import * as React from 'react';
import '@client/styles/player.scss';
import ImageService from '../services/image';

export default class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
         playing: false
        }
    }
    clickPlayer() {   
        // debugger  // this = React对象   
        this.play(this.props);
    }

    onEnded(that) {
        // debugger // this = audio
        that.setState({
            playing: false,
        })
    }
    onError() {
       
    }
    componentWillReceiveProps(newProps) {
        if(newProps.trueAnswer){
            this.play(this.props)
        }
    }

    componentDidMount() {

     }


     play(props) {
        // debugger // this = React对象   
         const {content} = props;
         let {playing} = this.state;
         this.pause();
         if(!this.audio){
            this.audio = new Audio();
            this.audio.onerror = this.onError();
            this.audio.onended = this.onEnded(this);// this = React对象   
            this.audio.src = "/api/audios/"+content;
            this.audio.play();
            this.setState({playing: true});
         }else {
            this.audio.play();
         } 
         
     }

     pause() {
         if(this.audio) {
            this.audio.pause();
         }

     }

    render() {
        const {content, trueAnswer,imgSRC} = this.props;
        if(!content) return null;
        return (<div className = "player">
                   <div className="audio-button" onClick={this.clickPlayer.bind(this)}>
                        <img src={`/api/images/${imgSRC}`} id="IMGPLAY"/>
                    </div> 
                </div>
         )
    }
}
