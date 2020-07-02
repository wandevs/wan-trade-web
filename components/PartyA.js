import { Component } from 'react';
import { Row, Col, Input, Button, message } from 'antd';
import { getTransactionReceipt } from "wan-dex-sdk-wallet";
import copy from 'clipboard-copy';
import TokenInfo from './TokenInfo';
import LimitInfo from './LimitInfo';
import { getApproveState, enable, disable, buildOrder, toWei, dexContract, getTokenDecimal, getTokenBalance, isValidAddress, dexScAddr } from '../utils/chainHelper';
import styles from './style.less';
import BigNumber from 'bignumber.js';

const { TextArea } = Input;

class PartyA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sellAmount: '',
      sellTokenSymbol: '',
      sellTokenAddress: '',
      buyAmount: '',
      buyTokenSymbol: '',
      buyTokenAddress: '',
      addressPartyA: '',
      addressPartyB: '',
      orderData: '',
      timeout: '10min',
      limitChecked: false,
      limitLoading: false,
      signatureLoading: false,
      cancelLoading: false,
      cancelDisabled: true,
    }
  }

  componentDidMount() {
    if (this.props.selectedAccount) {
      this.setState({
        addressPartyA: this.props.selectedAccount.get('address')
      })
    }
  }

  componentWillUpdate(props) {
    const address = this.props.selectedAccount ? this.props.selectedAccount.get('address') : "Select Address in Right-Top Wallet Button";
    if (address !== this.state.addressPartyA) {
      this.setState({ addressPartyA: address });
    }
  }

  updateBuyInfo = (buyAmount, buyTokenAddress, buyTokenSymbol) => {
    this.setState({ buyAmount, buyTokenAddress, buyTokenSymbol });
  }

  updateSellInfo = (sellAmount, sellTokenAddress, sellTokenSymbol) => {
    console.log('updateSellInfo');
    if(this.state.addressPartyA === '') {
      return;
    }
    this.setState({ sellAmount, sellTokenAddress, sellTokenSymbol, limitLoading: true });
    if (isNaN(Number(this.state.sellAmount))) {
      return;
    }
    setTimeout(async () => {
      console.log('getApproveState', sellTokenAddress, this.state.addressPartyA, this.state.sellAmount);
      let approved = await getApproveState(sellTokenAddress, this.state.addressPartyA, this.state.sellAmount);
      console.log('getApproveState:', approved);

      approved = approved === 'ERR' ? false : approved;
      this.setState({ limitChecked: approved, limitLoading: false });
    }, 0);
  }

  updateLimitInfo = (timeout) => {
    this.setState({ timeout });
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

  onLimitChange = (v) => {
    if (!this.state.sellTokenAddress) {
      message.info("Please fill sell token info first");
      return;
    }

    this.setState({ limitLoading: true });

    setTimeout(async () => {
      try {
        let ret = false;
        if (v) {
          ret = await enable(this.state.sellTokenAddress, this.props.wallet, this.state.sellAmount);
        } else {
          ret = await disable(this.state.sellTokenAddress, this.props.wallet);
        }
        if (ret) {
          this.setState({ limitLoading: false, limitChecked: v });
          return;
        }
      } catch (err) {
        message.error(err.toString());
      }
      this.setState({ limitLoading: false });
    }, 0);
  }

  onClickSignature = async () => {
    try {
      this.setState({ signatureLoading: true, cancelDisabled: true, });
      const { wallet } = this.props;
      const { sellAmount, buyAmount, sellTokenAddress, buyTokenAddress, addressPartyA, addressPartyB, sellTokenSymbol, buyTokenSymbol } = this.state;
      if (!isValidAddress(addressPartyB) || !isValidAddress(sellTokenAddress) || !isValidAddress(buyTokenAddress)) {
        message.warn('Invalid address');
        this.setState({ signatureLoading: false });
        return;
      }
      const userAddress = this.props.selectedAccount.get('address');
      const timeout = this.getTimeout();
      const sellDecimal = await getTokenDecimal(sellTokenAddress);
      const sellBalance = await getTokenBalance(sellTokenAddress, userAddress);
      const buyDecimal = await getTokenDecimal(buyTokenAddress);
      const buyBalance = await getTokenBalance(buyTokenAddress, this.state.addressPartyB);
      if (Number.isNaN(parseFloat(sellAmount)) || Number.isNaN(parseFloat(buyAmount))) {
        message.warn('Invalid amount value');
        this.setState({ signatureLoading: false });
        return;
      }

      if (new BigNumber(sellAmount).gt(sellBalance) || new BigNumber(buyAmount).gt(buyBalance)) {
        message.warn("Amount out of balance");
        this.setState({ signatureLoading: false });
        return;
      }

      let makerOrdersParam = {
        trader: addressPartyA,
        relayer: addressPartyB,
        version: 2,
        side: 'sell',
        type: 'limit',
        expiredAtSeconds: timeout,
        makerRebateRate: 0,
        asMakerFeeRate: 0,
        asTakerFeeRate: 0,
        quoteTokenAmount: toWei(buyAmount, buyDecimal),
        baseTokenAmount: toWei(sellAmount, sellDecimal),
        gasTokenAmount: 0,
        sellTokenSymbol,
        buyTokenSymbol,
        sellTokenAddress,
        buyTokenAddress,
      }
      let exchange = dexContract;
      let signedData = await buildOrder(
        makerOrdersParam,
        exchange,
        sellTokenAddress,
        buyTokenAddress,
        wallet
      );

      makerOrdersParam.signedData = signedData;
      console.log('makerOrdersParam:', makerOrdersParam);
      this.setState({
        orderData: JSON.stringify(makerOrdersParam),
        signatureLoading: false,
        cancelDisabled: false,
      });
      message.success('Sign order data successfully');
    } catch (e) {
      message.warn(e.toString());
      this.setState({
        orderData: '',
        signatureLoading: false,
      });
    }
  }

  onCopyData = (e) => {
    copy(this.state.orderData).then(data => {
      message.success('Copy to clipboard successfully');
    }, err => {
      message.error('Copy failed');
    });
  }

  onCancel = async () => {
    const { orderData } = this.state;
    if (orderData.length === 0) {
      message.warn('No signed order to cancel');
    }
    this.setState({ cancelLoading: true });

    const data = JSON.parse(orderData);
    const hash = data.signedData.orderHash;
    const order = {
      trader: data.trader,
      relayer: data.relayer,
      baseToken: data.sellTokenAddress,
      quoteToken: data.buyTokenAddress,
      baseTokenAmount: data.baseTokenAmount,
      quoteTokenAmount: data.quoteTokenAmount,
      data: data.signedData.data,
      gasTokenAmount: 0
    };

    const cancelled = await dexContract.methods.cancelled(hash).call();
    if (cancelled) {
      message.info('The order has been cancelled');
      this.setState({ cancelLoading: false });
    } else {
      try {
        const encoded = await dexContract.methods.cancelOrder(order).encodeABI();
        const params = {
          to: dexScAddr,
          data: encoded,
          value: 0,
          gasPrice: "0x3B9ACA00",
          gasLimit: "0x989680", // 10,000,000
        };
        let transactionID = await this.props.wallet.sendTransaction(params);
        this.watchTransactionStatus(transactionID, (ret) => {
          console.log('watchTransactionStatus res:', ret);
          if (ret) {
            message.success('Cancel order successfully');
          } else {
            message.error('Cancel order failed');
          }
          this.setState({ cancelLoading: false });
        });
      } catch (err) {
        console.log('err:', err);
        message.warn('Cancel order failed');
        this.setState({ cancelLoading: false });
      }
    }
    this.setState({ cancelLoading: false });
  }

  watchTransactionStatus = (txID, callback) => {
    const getTransactionStatus = async () => {
      const tx = await getTransactionReceipt(txID);
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
    const { addressPartyA, addressPartyB, limitChecked, limitLoading, orderData } = this.state;
    return (
      <div>
        <div className={styles['border']}>
          <Row><h3>Address Information</h3></Row>
          <Row>
            <Col span={6} className="leftLabel">
              <Row><p>Party A Address:</p></Row>
              <Row><p>Party B Address:</p></Row>
            </Col>
            <Col span={18} className={styles['paddingRight']}>
              {
                addressPartyA === '' ? <Row><p>Please select your wallet before trade.</p></Row> : <Row><p>{addressPartyA}</p></Row>
              }
              <Row><Input value={addressPartyB} onChange={e => this.setState({ addressPartyB: e.target.value.toLowerCase() })} /></Row>
            </Col>
          </Row>
        </div>
        <Row>
          <TokenInfo title={"Sell Token Information"} userAddress={addressPartyA} updateInfo={this.updateSellInfo} />
        </Row>
        <Row>
          <TokenInfo title={"Buy Token Information"} userAddress={addressPartyB} updateInfo={this.updateBuyInfo} />
        </Row>
        <Row>
          <LimitInfo checked={limitChecked} loading={limitLoading} updateInfo={this.updateLimitInfo} onChange={this.onLimitChange} amountInfo={this.state.sellAmount.toString() + ' ' + this.state.sellTokenSymbol} />
        </Row>
        <Row>
          <Button type="primary" onClick={this.onClickSignature} loading={this.state.signatureLoading} disabled={!limitChecked}>Signature Order</Button>
        </Row>
        <Row>
          <div className={styles['border']}>
            <Row><h3>Signed Order Data</h3></Row>
            <Row>
              <p style={{ textAlign: "left" }}>* Please copy the signed order data below and send it to Party B to complete the private exchange.</p>
            </Row>
            <Row>
              <TextArea id="orderDataField" disabled={true} rows={4} value={orderData} />
            </Row>
            <Row>
              <p style={{ textAlign: "left" }}>* To cancel the order, click the "Cancel Order" button below before Part B has completed their  side of the transaction.</p>
            </Row>
            <Row><Button type="primary" onClick={this.onCopyData}>Copy Data</Button></Row>
            <Row><Button type="slave" onClick={this.onCancel} loading={this.state.cancelLoading} disabled={this.state.cancelDisabled}>Cancel Order</Button></Row>
          </div>
        </Row>
      </div>
    );
  }
}

export default PartyA;