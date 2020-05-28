import { Component } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { WalletButton } from "wan-dex-sdk-wallet";
import TokenInfo from './TokenInfo';
import LimitInfo from './LimitInfo';

import styles from './style.less';

const { TextArea } = Input;

class PartyA extends Component {
  render() {
    const address = this.props.selectedAccount ? this.props.selectedAccount.get('address') : "Select Address in Right-Top Wallet Button";
    console.log(address);
    return (
      <div>
        <div className={styles['border']}>
        <Row><h3>Fill Address Information</h3></Row>
        <Row>
          <Col span={8}>
            <Row><p>Party A Address:</p></Row>
            <Row><p>Party B Address:</p></Row>
          </Col>
          <Col span={16}>
            <Row><p>{address}</p></Row>
            <Row><Input /></Row>
          </Col>
        </Row>
        </div>
        <Row>
          <TokenInfo title={"Fill Buy Token Information"} />
        </Row>
        <Row>
          <TokenInfo title={"Fill Sell Token Information"} />
        </Row>
        <Row>
          <LimitInfo />
        </Row>
        <Row>
          <Button type="primary">Signature Order</Button>
        </Row>
        <Row>
          <div className={styles['border']}>
            <Row><h3>Signed Order Data</h3></Row>
            <Row><p>* Please copy the signed order data below and send it to Party B to complete the private exchange.</p></Row>
            <Row><TextArea disabled={true} /></Row>
            <Row><p>* If you want to Cancel the Order, You can click Cancel Button below before it send to block chain by Party B.</p></Row>
            <Row><Button type="slave">Cancel Order</Button></Row>
          </div>
        </Row>
      </div>
    );
  }
}

export default PartyA;