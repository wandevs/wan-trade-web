import { Component } from 'react';
import tokenList from "./tokenList.json";
import { Row, Col, Input, Select, message } from 'antd';
import styles from './style.less';
import { getTokenBalance, isValidAddress } from '../utils/chainHelper';
import BigNumber from 'bignumber.js';

const { Option } = Select;
const { Search } = Input;

class TokenInfo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tokenSymbol: "",
      tokenAddress: "",
      balance: "",
      amount: "",
      tokenAddressDisable: true,
      loading: false,
      amountDisable: true
    }
  }

  onChange = (value) => {
    console.log('onChange:', value);
    let tokenAddress = "";
    if (value === 'Custom Token') {
      this.setState({ tokenSymbol: value, tokenAddressDisable: false, tokenAddress, loading: false, amountDisable: true, balance: "", amount: "" });

    } else {
      tokenAddress = (tokenList.find((v, i) => { return v.symbol === value })).tokenAddress;
      this.setState({ tokenSymbol: value, tokenAddressDisable: true, tokenAddress, loading: true, amountDisable: true });
      this.props.updateInfo(this.state.amount, tokenAddress, this.state.tokenSymbol);
      setTimeout(async () => {
        try {
          let balance = await getTokenBalance(tokenAddress, this.props.userAddress);
          this.setState({ loading: false, balance, amountDisable: false });
        } catch (error) {
          message.warn("Get token balance failed");
          this.setState({ loading: false });
        }
      }, 0);
    }
  }

  onTokenAddressChange = async (e) => {
    let tokenAddress = e.target.value;
    let isValid = isValidAddress(tokenAddress);
    console.log('isValid:', isValid);
    if (!isValid) {
      this.setState({ loading: false, balance: "", tokenAddress, amountDisable: true, amount: "" });
      return;
    }
    this.setState({ tokenAddress, loading: true });
    this.props.updateInfo(this.state.amount, tokenAddress, this.state.tokenSymbol);
    setTimeout(async () => {
      try {
        let balance = await getTokenBalance(tokenAddress, this.props.userAddress);
        console.log('balance:', balance);
        this.setState({ loading: false, balance, amountDisable: balance === 0 });
      } catch (error) {
        message.error('Get token balance failed, please check the token address is valid');
        this.setState({ loading: false, balance: '', amountDisable: true, amount: "" });
      }
    }, 0);
  }

  onTokenAmountChange = (e) => {
    let amount = e.target.value;
    if (amount === '') {
      this.setState({ amount: '' });
      return;
    }

    if (isNaN(Number(amount))) {
      return;
    }

    let balance = this.state.balance;
    if (balance !== '') {
      if (new BigNumber(amount).gt(balance)) {
        message.warn("Amount out of balance");
        this.setState({ amount: 0 });
        return;
      }
    }

    this.setState({ amount });
    this.props.updateInfo(amount, this.state.tokenAddress, this.state.tokenSymbol);
  }

  render() {
    const { data, isDisabled } = this.props;
    let vTokenList = tokenList.slice();
    vTokenList.push({
      "symbol": "Custom Token",
      "tokenAddress": ""
    });
    return (
      <div className={styles["border"]}>
        <Row><h3>{this.props.title}</h3></Row>
        <Row>
          <Col span={8}>
            <Row><p>Token:</p></Row>
            <Row><p>Token Address:</p></Row>
            <Row><p>Address:</p></Row>
            <Row><p>Balance:</p></Row>
            <Row><p>Amount:</p></Row>
          </Col>
          <Col span={16}>
            <Row>
              <Select style={{ width: "424px" }} disabled={isDisabled === true} onChange={this.onChange} value={data ? data.tokenSymbol : this.state.tokenSymbol}>
                {
                  vTokenList.map((v, i) => {
                    return (
                      <Option value={v.symbol} key={v.symbol}>
                        {v.symbol}
                      </Option>
                    );
                  })
                }
              </Select>
            </Row>
            <Row>
              <Input disabled={this.state.tokenAddressDisable} value={data ? data.tokenAddress : this.state.tokenAddress} onChange={this.onTokenAddressChange} />
            </Row>
            <Row>
              <Input disabled={true} value={data ? data.address : this.props.userAddress} />
            </Row>
            <Row>
              <Search disabled={true} value={data ? data.balance : this.state.balance} loading={this.state.loading} />
            </Row>
            <Row>
              <Input disabled={isDisabled || this.props.verify || this.state.amountDisable} value={data ? data.amount : this.state.amount} onChange={this.onTokenAmountChange} suffix={this.state.tokenSymbol} />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TokenInfo;