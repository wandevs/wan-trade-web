import { Component } from 'react';
import { Row, Col, Input } from 'antd';
import { WalletButtonLong } from "wan-dex-sdk-wallet";

import styles from './style.less';

class PartyA extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col span={10}>My Address:</Col>
          <Col span={14}><WalletButtonLong/></Col>
        </Row>
        <Row>
          <Col span={10}>Party B Address</Col>
          <Col span={14}><Input/></Col>
        </Row>
        <Row></Row>
        <Row></Row>
        <Row></Row>
        <Row></Row>
        <Row></Row>
      </div>
    );
  }
}

export default PartyA;