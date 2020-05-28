import { Component } from 'react';
import { Row, Col, Input, Button } from 'antd';
import { WalletButtonLong } from "wan-dex-sdk-wallet";
import TokenInfo from './TokenInfo';
import LimitInfo from './LimitInfo';

import styles from './style.less';

const { TextArea } = Input;

class PartyB extends Component {
  render() {
    return (
      <div>
        <div className={styles['border']}>
          <Row>
            <Row><h3>Paste Party A's Signed Order Data </h3></Row>
            <Row><TextArea /></Row>
          </Row>
        </div>
        <Row>
          <Button type="primary">Parse</Button>
        </Row>
        <Row>
          <TokenInfo title={"Verify Sell Token Information"} verify={true} />
        </Row>
        <Row>
          <TokenInfo title={"Verify Sell Token Information"} verify={true} />
        </Row>
        <Row>
          <LimitInfo />
        </Row>
        <Row>
          <Button type="primary">Send to Exchange</Button>
        </Row>

      </div>
    );
  }
}

export default PartyB;