import { connect } from "react-redux";
import { Component } from "../components/base";
import { Tabs, Row, Col, Input, Slider, Radio, Table, Button, Divider } from "antd";
import BigNumber from 'bignumber.js';
import { Wallet, getSelectedAccount, WalletButton, WalletButtonLong, getSelectedAccountWallet, getTransactionReceipt } from "wan-dex-sdk-wallet";
import "wan-dex-sdk-wallet/index.css";
import styles from './style.less';
import { mainnetSCAddrWan2Btc, testnetSCAddrWan2Btc, networkId, nodeUrl } from '../conf/config.js';
import PartyA from "../components/PartyA";
import PartyB from "../components/PartyB";

const lotterySCAddr = networkId == 1 ? mainnetSCAddrWan2Btc : testnetSCAddrWan2Btc;

var Web3 = require("web3");

const { TabPane } = Tabs;


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

  onTabChange = (key) => {
    console.log(key);
  }

  render() {
    return (
      <div className={[styles.center, styles.app].join(' ')}>
        <Tabs onChange={this.onTabChange} type="card">
          <TabPane tab="Party A" key="1">
            <PartyA/>
          </TabPane>
          <TabPane tab="Party B" key="2">
            <PartyB/>
          </TabPane>
        </Tabs>
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





