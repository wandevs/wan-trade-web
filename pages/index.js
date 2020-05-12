import { connect } from "react-redux";
import { Component } from "../components/base";
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





