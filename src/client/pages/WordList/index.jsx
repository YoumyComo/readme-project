import * as React from 'react';
import Net from '../../lib/Net';
import ListUnit from './ListUnit';
import Player from '@client/components/Player';
import '@client/styles/wordList.scss';
import Charpter from '../../services/Charpter';
import Audio from '../../components/Audio';
import AudioPUT from '../../services/Audio';
import { transaction } from 'mobx';
const net = new Net();

export default class WordList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            trackIndex: 0, //当前播放的歌曲索引，默认加载第一首歌
            playStatus: false, // true 为播放状态，false 为暂停状态   
        };
    }

    clickPlayer(){
        this.setState({playStatus:!this.state.playStatus});
    }

    startAutoPlay() {
        this.setState({
            playStatus: true,
        })
    }
    onAudioError = (e) => {
        console.error(e);
        this.onAudioEnded();
    }
    onAudioEnded = () => {
        let { trackIndex, charpter } = this.state;
        trackIndex++;
        if (trackIndex < charpter.words.length ) {
            this.setState({ trackIndex });
        } else {
            this.setState({
                trackIndex: 0,
                playStatus: false,
            });
        }
    }

    async componentDidMount() {
       const charpter = await Charpter.getCharpterByQRCode(this.props.match.params.qrcode);
       this.setState({ charpter });
       // this.startAutoPlay(); // 打开网页后自动朗读
    }

    render() {
        const { charpter, playStatus, trackIndex } = this.state;
        
        //问题1： 如果除了chapter外还有其他属性该怎么写 ？？？
        if (!charpter) return null;
        const { words } = charpter;
        return (
            <div className = 'wordList'>
                { words.map((word, index) => <ListUnit key={word.spell} word={word} highlight={index === trackIndex}/>) }
                <div onClick = {this.clickPlayer.bind(this)}> {this.state.playStatus ? '暂停':'播放'}
                    <Audio playing={playStatus} src={`/api/audios/${words[trackIndex].spell}`} onEnded={this.onAudioEnded} onError={this.onAudioError}/>
                </div>
            </div>
        );
    }
}
