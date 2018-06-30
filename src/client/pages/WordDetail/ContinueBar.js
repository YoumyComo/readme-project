import * as React from 'react';
import '@client/styles/continueBar.scss';
import {Link} from 'react-router-dom';
export default class ContinueBar extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { word } = this.props;
        return (<Link  to = {{
                  pathname: `/word_spell/${word.spell}`,
                }} >
                    <div className = "continueBar">
                        <p>继续>></p>
                    </div>
                </Link>
         )
    }
}
