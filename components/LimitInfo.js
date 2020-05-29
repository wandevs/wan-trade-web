import { Component } from 'react';
import { Row, Col, Switch, Select } from 'antd';
import styles from './style.less';
const { Option } = Select;


class LimitInfo extends Component {
  render() {
    return (
      <div className={styles['border']}>
        <Row><h3>Fill Exchange Limit</h3></Row>
        <Row>
          <Col span={8}><p>Timeout:</p></Col>
          <Col span={16}>
            <Select style={{width: "424px"}} defaultValue="10min">
              <Option value="10min">10 min</Option>
              <Option value="1hour">1 hour</Option>
              <Option value="1day">1 day</Option>
              <Option value="1week">1 week</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={2}></Col>
          <Col span={22}><p style={{textAlign:"left"}}>* You must enable switch below to approve smart contract to operate your tokens until exchange finish, otherwise the exchange will not succeed.</p></Col>
        </Row>
        <Row>
          <Col span={8}>Approve Switch:</Col>
          <Col span={16} style={{textAlign: 'left'}}>
            <Switch checked={this.props.checked} loading={this.props.loading} onChange={this.props.onChange} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default LimitInfo;
