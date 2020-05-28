import { Component } from 'react';
import tokenList from "./tokenList.json";
import { Row, Col, Input, Select } from 'antd';
import styles from './style.less';

class TokenInfo extends Component {
  render() {
    return (
      <div className={styles["border"]}>
        <Row><h3>{this.props.title}</h3></Row>
        <Row>
        <Col span={8}>
          <Row><p>Token:</p></Row>
          <Row><p>Token Address:</p></Row>
          <Row><p>Balance:</p></Row>
          <Row><p>Amount:</p></Row>
        </Col>
        <Col span={16}>
          <Row>
            <Select/>
          </Row>
          <Row>
            <Input disabled={true}/>
          </Row>
          <Row>
            <Input disabled={true}/>
          </Row>
          <Row>
            <Input disabled={this.props.verify}/>
          </Row>
        </Col>
        </Row>
      </div>
    );
  }
}

export default TokenInfo;