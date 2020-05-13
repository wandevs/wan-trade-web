import { connect } from "react-redux";
import { Component } from "../components/base";
import { Row, Col, Input, Slider, Radio, Table, Button, Divider } from "antd";
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

  hedgeColumn = [
    {
      title: 'Token name',
      dataIndex: "tokenName",
      key: 'tokenName',
    },
    {
      title:'Underlying assets price',
      dataIndex:'underlyingAssetsPrice',
      key:'underlyingAssetsPrice',
    },
    {
      title:'Expiration',
      dataIndex:'expiration',
      key:'expiration',
    },
    {
      title:'Strike price',
      dataIndex:'strikePrice',
      key:'strikePrice',
    },
    {
      title:'Liquidity',
      dataIndex:'liquidity',
      key:'liquidity',
    },
    {
      title:'Price',
      dataIndex:'price',
      key:'price',
    },
    {
      title:'Percentage of collateral',
      dataIndex:'percentageOfCollateral',
      key:'percentageOfCollateral',
    },
  ]

  leverageColumn = [

  ]

  myAssetsColumn = [
    {
      title: 'Token name',
      dataIndex: "tokenName",
      key: 'tokenName',
    },
    {
      title:'Underlying assets price',
      dataIndex:'underlyingAssetsPrice',
      key:'underlyingAssetsPrice',
    },
    {
      title:'Strike price',
      dataIndex:'strikePrice',
      key:'strikePrice',
    },
    {
      title:'Amount',
      dataIndex:'amount',
      key:'amount',
    },
    {
      title:'Price paid',
      dataIndex:'pricePaid',
      key:'pricePaid',
    },
    {
      title:'Price now',
      dataIndex:'priceNow',
      key:'priceNow',
    },
    {
      title:'Percentage of collateral',
      dataIndex:'percentageOfCollateral',
      key:'percentageOfCollateral',
    },
    {
      title:'Expected Return',
      dataIndex:'expectedReturn',
      key:'expectedReturn',
    },
    {
      title:'',
      dataIndex:'',
      key:'action',
      render: () => {
        return(<Button type="primary">Sell now</Button>)
      }
    },
  ]

  hedgeDemo = [
    {
      tokenName:'BTC call, 9th 5, $7000',
      underlyingAssetsPrice:'$7200',
      expiration:'9th 5',
      strikePrice:'$7000',
      liquidity:'20',
      price:'$60',
      percentageOfCollateral:'130%',
    }
  ]

  leverageDemo = [
    {
      tokenName:'BTC put, 9th 5, $7000',
      underlyingAssetsPrice:'$7200',
      expiration:'9th 5',
      strikePrice:'$7000',
      liquidity:'20',
      price:'$60',
      percentageOfCollateral:'130%',
    }
  ]

  myAssetDemo = [
    {
      tokenName:'BTC call, 9th 5, $7000',
      underlyingAssetsPrice:'$7200',
      strikePrice:'$7000',
      amount:'20',
      pricePaid:'$60',
      priceNow:'$180',
      percentageOfCollateral:'130%',
      expectedReturn: '$200'
    },
    {
      tokenName:'BTC put, 9th 5, $7000',
      underlyingAssetsPrice:'$7200',
      strikePrice:'$7000',
      amount:'30',
      pricePaid:'$60',
      priceNow:'$80',
      percentageOfCollateral:'120%',
      expectedReturn: '$0'
    }

  ]

  render() {
    return (
      <div>
        <div className={styles.box}>
          <h1>Hedge risk of your BTC value down</h1>
          <Row gutter={[16, 16]} className={styles.center}>
            <Col span={4}>How many BTC are you holding</Col>
            <Col span={4}>Expiration</Col>
            <Col span={3}>Currency to pay</Col>
            <Col span={6}>Hedge Price in $ / chose currency</Col>
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
          <Table dataSource={this.hedgeDemo} columns={this.hedgeColumn} />
          <div className={styles.center}>
            <Button type="primary" style={{margin: "20px"}}>Hedge Now</Button>
          </div>
        </div>
        <Divider/>
        <div className={styles.box}>
          <h1>Leverage your BTC</h1>
          <Row gutter={[16, 16]} className={styles.center}>
            <Col span={4}>How many BTC are you plan to leverage</Col>
            <Col span={4}>Expiration</Col>
            <Col span={3}>Currency to pay</Col>
            <Col span={6}>Leverage Price in $ / chose currency</Col>
            <Col span={6}>Return due to the price go up in percentage</Col>
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
          <Table dataSource={this.leverageDemo} columns={this.hedgeColumn}/>
          <div className={styles.center}>
            <Button type="primary" style={{margin: "20px"}}>Leverage Now</Button>
          </div>
        </div>
        <Divider/>
        <div className={styles.box}>
          <h1>My assets</h1>
          <Table dataSource={this.myAssetDemo} columns={this.myAssetsColumn}/>
        </div>
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





