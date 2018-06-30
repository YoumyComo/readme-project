import * as React from 'react';

export default class AudioComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(newProps) {
        // 点击按钮后执行  比componentDidMount晚
        if (newProps.src != this.props.src) { // src发生改变，即到下一个音频
            this.play(newProps);
        } else if (newProps.playing != this.props.playing) { // src不改变，播放状态变化，即在暂停和播放之间切换
            if (newProps.playing) {
                this.continuePlay(newProps)
            } else {
                this.pause(newProps);
            }
        }
    }

    componentDidMount() {
        //debugger// 先执行 仅执行一次
        this.play(this.props);
    }

    componentWillUnmount() {
        this.pause(this.props);
    }

    pause() {
        if (this.audio) {
            this.audio.pause();
        }
    }

    continuePlay(props) {
        if (this.audio) {
            this.audio.play();
        } else {
            this.play(props);
        }
    }

    play(props) {
        const { src, playing } = props;
        this.pause(props);
        if (!playing) return;
        this.audio = new Audio();
        this.audio.onerror = this.onError;
        this.audio.onended = this.onEnded;
        this.audio.src = src;
        this.audio.play();
    }

    onError = (e) => {
        const { onError } = this.props;
        if (onError) {
            onError(e);
        }
    }

    onEnded = (e) => {
        const { onEnded } = this.props;
        if (onEnded) {
            onEnded(e);
        }
    }

    render() {
        return null;
    }
}