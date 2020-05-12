import { connect } from "react-redux";
import { Component } from "../components/base";
import { Row, Col, Input, Slider, Radio, Table } from "antd";
import BigNumber from 'bignumber.js';
import { Wallet, getSelectedAccount, WalletButton, WalletButtonLong, getSelectedAccountWallet, getTransactionReceipt } from "wan-dex-sdk-wallet";
import "wan-dex-sdk-wallet/index.css";
import styles from './style.less';
import { mainnetSCAddrWan2Btc, testnetSCAddrWan2Btc, networkId, nodeUrl } from '../conf/config.js';

const lotterySCAddr = networkId == 1 ? mainnetSCAddrWan2Btc : testnetSCAddrWan2Btc;

var Web3 = require("web3");

let debugStartTime = (Date.now() / 1000)


class IndexPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  async componentDidMount() {
    var web3 = new Web3();
    if (nodeUrl.includes('wss')) {
      web3.setProvider(new Web3.providers.WebsocketProvider(nodeUrl));
    } else {
      web3.setProvider(new Web3.providers.HttpProvider(nodeUrl));
    }
    this.web3 = web3;
    // this.lotterySC = new this.web3.eth.Contract(lotteryAbi, lotterySCAddr);

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <div className={styles.box}>
          <h1>Hedge risk of your BTC value down</h1>
          <Row gutter={[16, 16]} className={styles.center}>
            <Col span={4}>How many BTC are you holding</Col>
            <Col span={4}>Expiration</Col>
            <Col span={3}>Currency to pay</Col>
            <Col span={6}>Hedge Price in $ / choosed currency</Col>
            <Col span={6}>Risk due to the price go down in percentage</Col>
          </Row>
          <Row gutter={[16, 16]} className={styles.center}>
            <Col span={4}>
              <Row gutter={[16, 16]}>
                <Col span={12}><Input /></Col>
                <Col span={12}><Slider /></Col>
              </Row>
            </Col>
            <Col span={4}>
              <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a">15/May</Radio.Button>
                <Radio.Button value="b">30/May</Radio.Button>
              </Radio.Group>
            </Col>
            <Col span={3}>
              <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a">WAN</Radio.Button>
                <Radio.Button value="b">FNX</Radio.Button>
              </Radio.Group>
            </Col>
            <Col span={6}>$100 / WAN 1000</Col>
            <Col span={6}>
              <Row gutter={[16, 16]}>
                <Col span={8}>$1,100</Col>
                <Col span={16}><Slider /></Col>
              </Row>
            </Col>
          </Row>
          <Table />
        </div>
        <div></div>
        <div></div>
      </div>
    );
  }
}

export default connect(state => {
  const selectedAccountID = state.WalletReducer.get('selectedAccountID');
  return {
    selectedAccount: getSelectedAccount(state),
    selectedWallet: getSelectedAccountWallet(state),
    networkId: state.WalletReducer.getIn(['accounts', selectedAccountID, 'networkId']),
    selectedAccountID,
  }
})(IndexPage);





