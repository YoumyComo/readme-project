import * as React from 'react';
import Player from '@client/components/Player';
import '@client/styles/wordSpell.scss';

export default class WordSpell extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {};       
    }

    render() {
        return (<div className = 'WordSpell'>
            WordSpell
            <Player/>
        </div>);
    }
}