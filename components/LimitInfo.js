import { Component } from 'react';
import { Row, Col, Switch, Select, Input } from 'antd';
import styles from './style.less';
const { Option } = Select;

class LimitInfo extends Component {
  render() {
    const { timerValue, part } = this.props;
    return (
      <div className={styles['border']}>
        <Row><h3>Timeout Limit And Approve</h3></Row>
        {
          part === 'B' && (<Row>
            <Col span={6} className="leftLabel"><p>Expiration:</p></Col>
            <Col span={18} className={styles['paddingRight']}>
              <Input disabled={true} value={timerValue === 'expired' ? 'Expired' : timerValue} style={timerValue === 'expired' ? { border: '1px solid red' } : {}} />
            </Col>
          </Row>)
        }
        {
          part !== 'B' && (<Row>
            <Col span={6} className="leftLabel"><p>Transaction Timeout:</p></Col>
            <Col span={18} className={styles['paddingRight']}>
              <Select style={{ width: "100%" }} defaultValue="10min" disabled={this.props.selectionDisabled} onChange={this.props.updateInfo}>
                <Option value="10min">10 min</Option>
                <Option value="1hour">1 hour</Option>
                <Option value="1day">1 day</Option>
                <Option value="1week">1 week</Option>
              </Select>
            </Col>
          </Row>)
        }
        <Row>
          <Col span={6} className="leftLabel"><p>Approve:</p></Col>
          <Col span={6} style={{textAlign: 'left'}}>
            <Switch style={{margin: '1em 0em', verticalAlign: 'text-top'}} checked={this.props.checked} loading={this.props.loading} onChange={this.props.onChange} />
          </Col>
          <Col span={12}><div style={{margin: '1.1em 0em', verticalAlign: 'text-top', textAlign: 'left'}}>{this.props.amountInfo}</div></Col>
        </Row>
        <Row>
          <Col span={24}><p style={{ textAlign: "left" }}>* Toggle the "Approve" switch to allow the smart contract to operate with you tokens on your behalf. Required to complete transaction.</p></Col>
        </Row>
      </div>
    );
  }
}

export default LimitInfo;
