import * as React from 'react';
import Net from '../lib/Net';
const net = new Net();


export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        
       
    }

    async componentDidMount() {
        const res = await net.request({
            method: 'get',
            url: {
                pathname: '/api/monitor/alive'
            }
        });

        console.log(res);
    }
    render() {
        return <h1>Hello World</h1>;
    }
}