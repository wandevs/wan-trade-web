import { Component } from 'react';
import { Row, Col, Switch, Select } from 'antd';
import styles from './style.less';
const { Option } = Select;


class LimitInfo extends Component {
  render() {
    return (
      <div className={styles['border']}>
        <Row><h3>Timeout Limit And Approve</h3></Row>
        <Row>
          <Col span={8} className="leftLabel"><p>Timeout:</p></Col>
          <Col span={16} className={styles['paddingRight']}>
            <Select style={{width: "100%"}} defaultValue="10min" disabled={this.props.selectionDisabled} onChange={this.props.updateInfo}>
              <Option value="10min">10 min</Option>
              <Option value="1hour">1 hour</Option>
              <Option value="1day">1 day</Option>
              <Option value="1week">1 week</Option>
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={3}></Col>
          <Col span={21}><p style={{textAlign:"left", padding: '0px 12px'}}>* You must enable switch below to approve smart contract to operate your tokens until exchange finish, otherwise the exchange will not succeed.</p></Col>
        </Row>
        <Row>
          <Col span={8} className="leftLabel"><p>Approve Switch:</p></Col>
          <Col span={16} style={{textAlign: 'left'}}>
            <Switch style={{margin: '1em 0em', verticalAlign: 'text-top'}} checked={this.props.checked} loading={this.props.loading} onChange={this.props.onChange} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default LimitInfo;
