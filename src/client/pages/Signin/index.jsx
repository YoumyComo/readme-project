import * as React from 'react';
import SigninForm from './SigninForm';

import WordService from '../../services/word';
import BookService from '../../services/book';

import '@client/styles/signin.scss';


import { Row, Col } from 'antd';



export default class Signin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }
    render() {
        return(
            <div className = "signin-wrapper">
                <Row gutter={16}>
                    <Col span={8} />
                    <Col span={8} >  <SigninForm/> </Col>
                    <Col span={8} />
                </Row>
            </div>
        )
    }
}