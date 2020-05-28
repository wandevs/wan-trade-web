import { Component } from 'react';
import { Row, Col, Switch, Select } from 'antd';
import styles from './style.less';


class LimitInfo extends Component {
  render() {
    return (
      <div className={styles['border']}>
        <Row><h3>Fill Exchange Limit</h3></Row>
        <Row>
          <Col span={8}><p>Timeout:</p></Col>
          <Col span={16}><Select /></Col>
        </Row>
        <Row><p>* You must enable switch below to approve smart contract to operate your tokens until exchange finish, otherwise the exchange will not succeed.</p></Row>
        <Row>
          <Col span={8}>Approve Switch:</Col>
          <Col span={16}><Switch /></Col>
        </Row>
      </div>
    );
  }
}

export default LimitInfo;
