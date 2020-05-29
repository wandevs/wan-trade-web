import { Component } from 'react';
import { Row, Col, Input, Button, message } from 'antd';
import { WalletButton } from "wan-dex-sdk-wallet";
import TokenInfo from './TokenInfo';
import LimitInfo from './LimitInfo';
import { getApproveState, enable, disable } from '../utils/chainHelper';

import styles from './style.less';

const { TextArea } = Input;

class PartyA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buyAmount: '',
      sellAmount: '',
      buyTokenAddress: '',
      sellTokenAddress: '',
      addressPartyA: '',
      addressPartyB: '',
      timeout: (Date.now()/1000 + 600).toFixed(0),
      limitChecked: false,
      limitLoading: false,
    }
  }

  updateBuyInfo = (buyAmount, buyTokenAddress) => {
    this.setState({ buyAmount, buyTokenAddress });
  }

  updateSellInfo = (sellAmount, sellTokenAddress) => {
    this.setState({ sellAmount, sellTokenAddress, limitLoading: true });
    setTimeout(async ()=>{
      let approved = await getApproveState(sellTokenAddress, this.state.addressPartyA, sellAmount);
      this.setState({limitChecked: approved, limitLoading: false});
    }, 0);
  }

  updateLimitInfo = (timeout) => {
    this.setState({timeout});
  }

  onLimitChange = (v) => {
    if (!this.state.sellTokenAddress) {
      message.info("Please fill sell token info first");
      return;
    }

    this.setState({limitLoading: true});

    setTimeout(async ()=>{
      try {
        let ret = false;
        if (v) {
          ret = await enable(this.state.sellTokenAddress, this.props.wallet);
        } else {
          ret = await disable(this.state.sellTokenAddress, this.props.wallet);
        }
        if (ret) {
          this.setState({limitLoading: false, limitChecked: v});
          return;
        }
      } catch (err) {
        message.error(err.toString());
      }
      this.setState({limitLoading: false});
    }, 0);
  }

  componentWillUpdate(props) {
    const address = this.props.selectedAccount ? this.props.selectedAccount.get('address') : "Select Address in Right-Top Wallet Button";
    if (address !== this.state.addressPartyA) {
      this.setState({ addressPartyA: address });
    }
  }

  render() {
    const address = this.props.selectedAccount ? this.props.selectedAccount.get('address') : "Select Address in Right-Top Wallet Button";
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
              <Row><Input value={this.state.addressPartyB} onChange={e => this.setState({ addressPartyB: e.target.value.toLowerCase() })} /></Row>
            </Col>
          </Row>
        </div>
        <Row>
          <TokenInfo title={"Fill Buy Token Information"} userAddress={this.state.addressPartyB} updateInfo={this.updateBuyInfo} />
        </Row>
        <Row>
          <TokenInfo title={"Fill Sell Token Information"} userAddress={address} updateInfo={this.updateSellInfo} />
        </Row>
        <Row>
          <LimitInfo checked={this.state.limitChecked} loading={this.state.limitLoading} updateInfo={this.updateLimitInfo} onChange={this.onLimitChange} />
        </Row>
        <Row>
          <Button type="primary">Signature Order</Button>
        </Row>
        <Row>
          <div className={styles['border']}>
            <Row><h3>Signed Order Data</h3></Row>
            <Row>
              <Col span={1}></Col>
              <Col span={23}><p style={{ textAlign: "left" }}>* Please copy the signed order data below and send it to Party B to complete the private exchange.</p></Col>
            </Row>
            <Row><TextArea disabled={true} rows={4} /></Row>
            <Row>
              <Col span={1}></Col>
              <Col span={23}><p style={{ textAlign: "left" }}>* If you want to Cancel the Order, You can click Cancel Button below before it send to block chain by Party B.</p></Col>
            </Row>
            <Row><Button type="primary">Copy Data</Button></Row>
            <Row><Button type="slave">Cancel Order</Button></Row>
          </div>
        </Row>
      </div>
    );
  }
}

export default PartyA;