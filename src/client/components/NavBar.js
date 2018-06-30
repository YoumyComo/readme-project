import * as React from 'react';
import '@client/styles/navBar.scss';



export default class NavBar extends React.Component {
    pushURL() {
        console.log('添加路径')
    }
    deleteURL() {
        console.log('删除路径')
    }
    constructor(props) {
        super(props);
        this.state = {'hiatoryURL':[]};
    }
    render() {
        return (<div className = "navBar">
                <p onClick={this.pushURL}> 前进 </p>
                <p onClick={this.deleteURL}>后退</p>
                </div>
         )
    }
}

