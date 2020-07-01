import { Component } from 'react';
import { Row, Col, Input, Button, message } from 'antd';
import { WalletButtonLong, getTransactionReceipt } from "wan-dex-sdk-wallet";
import TokenInfo from './TokenInfo';
import LimitInfo from './LimitInfo';
import { enable, disable, getTokenBalance, getTokenDecimal, fromWei, dexContract, buildOrder, dexScAddr, getApproveState } from '../utils/chainHelper';

import styles from './style.less';

const { TextArea } = Input;

class PartyB extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: '',
      sellData: null,
      buyData: null,
      parseLoading: false,
      limitChecked: false,
      limitLoading: false,
      timeout: '10min',
      makerOrder: {},
      takerOrder: {},
      baseToken: '',
      quoteToken: '',
      relayer: '',
      makerSignedData: null,
      exchangeLoading: false,
    }
  }

  onChange = (e) => {
    this.setState({
      orderData: e.target.value
    });
  }

  onParse = async () => {
    try {
      this.setState({
        parseLoading: true,
        limitLoading: true,
      });
      const { orderData, timeout } = this.state;
      let data = JSON.parse(orderData);
      // console.log('data:', data);
      let buyBalance = await getTokenBalance(data.buyTokenAddress, data.relayer);
      let sellBalance = await getTokenBalance(data.sellTokenAddress, data.trader);
      let buyDecimal = await getTokenDecimal(data.buyTokenAddress);
      let sellDecimal = await getTokenDecimal(data.sellTokenAddress);
  
      this.setState({
        baseToken: data.sellTokenAddress,
        quoteToken: data.buyTokenAddress,
        relayer: data.relayer,
        sellData: {
          tokenSymbol: data.buyTokenSymbol,
          tokenAddress: data.buyTokenAddress,
          address: data.relayer,
          balance: buyBalance,
          amount: fromWei(data.quoteTokenAmount, buyDecimal),
        },
        buyData: {
          tokenSymbol: data.sellTokenSymbol,
          tokenAddress: data.sellTokenAddress,
          address: data.trader,
          balance: sellBalance,
          amount: fromWei(data.baseTokenAmount, sellDecimal),
        },
        makerOrder: data,
        takerOrder: {
          trader: data.relayer,
          relayer: data.relayer,
          version: data.version,
          side: 'buy',
          type: data.type,
          asMakerFeeRate: data.asMakerFeeRate,
          asTakerFeeRate: data.asTakerFeeRate,
          quoteTokenAmount: data.quoteTokenAmount,
          baseTokenAmount: data.baseTokenAmount,
          gasTokenAmount: data.gasTokenAmount,
        },
        makerSignedData: data.signedData,
        parseLoading: false,
      });
  
      let approved = await getApproveState(data.buyTokenAddress, data.relayer);
      approved = approved === 'ERR' ? false : approved;
      this.setState({ limitChecked: approved, limitLoading: false });
    } catch (err) {
      message.warn('Failed to parse order data');
      this.setState({
        parseLoading: false,
        limitLoading: false,
      });
    }
  }

  updateLimitInfo = (timeout) => {
    this.setState({ timeout });
  }

  onLimitChange = (v) => {
    const { sellData } = this.state;
    if (!(sellData && sellData.tokenAddress)) {
      message.info("Sell token info is required");
      return;
    }
    this.setState({ limitLoading: true });
    (async () => {
      try {
        let ret = false;
        if (v) {
          ret = await enable(sellData.tokenAddress, this.props.wallet);
        } else {
          ret = await disable(sellData.tokenAddress, this.props.wallet);
        }
        if (ret) {
          this.setState({ limitLoading: false, limitChecked: v });
          return;
        }
      } catch (err) {
        message.error(err.toString());
      }
      this.setState({ limitLoading: false });
    })();
  }

  getTimeout = () => {
    let time = Date.now() / 1000;
    const { timeout } = this.state;
    switch (timeout) {
      case '10min':
        time += 10 * 60;
        break;
      case '1hour':
        time += 60 * 60;
        break;
      case '1day':
        time += 24 * 60 * 60;
        break;
      case '1week':
        time += 7 * 24 * 60 * 60;
        break;
    }
    return time.toFixed(0);
  }

  sendExchange = async () => {
    try {
      const selectedAccount = this.props.selectedAccount;
      if (selectedAccount === null) {
        message.warn("Please select your wallet before trade.");
        return;
      }
      const isLocked = selectedAccount.get('isLocked');
      if (isLocked) {
        message.warn("Need to unlock wallet.");
        return;
      }
      const { makerSignedData, makerOrder, takerOrder, baseToken, quoteToken, relayer, limitChecked } = this.state;
      if (!limitChecked) {
        message.warn("Need to approve smart contract");
        return;
      }
      this.setState({
        exchangeLoading: true
      });
      takerOrder.expiredAtSeconds = this.getTimeout();
      let takerSignedData = await buildOrder(
        takerOrder,
        dexContract,
        baseToken,
        quoteToken,
        this.props.wallet
      );
      const encoded = await dexContract.methods.matchOrders(takerSignedData, [makerSignedData], [makerOrder.baseTokenAmount], {
        baseToken: baseToken,
        quoteToken: quoteToken,
        relayer
      }).encodeABI();
      const params = {
        to: dexScAddr,
        data: encoded,
        value: 0,
        gasPrice: "0x3B9ACA00",
        gasLimit: "0x989680", // 10,000,000
      };

      let transactionID = await this.props.wallet.sendTransaction(params);
      this.watchTransactionStatus(transactionID, (ret) => {
        if (ret) {
          message.success('Exchange successfully');
        } else {
          message.error('Exchange failed');
        }
        this.setState({
          exchangeLoading: false
        });
      });
    } catch (err) {
      message.error('Exchange failed.');
    }
  }

  watchTransactionStatus = (txID, callback) => {
    const getTransactionStatus = async () => {
      const tx = await getTransactionReceipt(txID);
      console.log('tx:', tx);
      if (!tx) {
        window.setTimeout(() => getTransactionStatus(txID), 3000);
      } else if (callback) {
        callback(Number(tx.status) === 1);
      } else {
        window.alertAntd('success');
      }
    };
    window.setTimeout(() => getTransactionStatus(txID), 3000);
  };

  render() {
    const { limitChecked, limitLoading, exchangeLoading } = this.state;
    return (
      <div>
        <div className={styles['border']}>
          <Row>
            <Row><h3>Paste Party A's Signed Order Data </h3></Row>
            <Row><TextArea rows={4} onChange={this.onChange} /></Row>
          </Row>
        </div>
        <Row>
          <Button type="primary" onClick={this.onParse} loading={this.state.parseLoading}>Parse</Button>
        </Row>
        <Row>
          <TokenInfo title={"Verify Sell Token Information"} verify={true} data={this.state.sellData} isDisabled={true} />
        </Row>
        <Row>
          <TokenInfo title={"Verify Buy Token Information"} verify={true} data={this.state.buyData} isDisabled={true} />
        </Row>
        <Row>
          <LimitInfo checked={limitChecked} loading={limitLoading} updateInfo={this.updateLimitInfo} onChange={this.onLimitChange} selectionDisabled={true} />
        </Row>
        <Row>
          <Button type="primary" onClick={this.sendExchange} disabled={!limitChecked} loading={exchangeLoading} >Send to Exchange</Button>
        </Row>
      </div>
    );
  }
}

export default PartyB;