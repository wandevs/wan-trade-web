import { Component } from 'react';
import tokenList from "./tokenList.json";
import { Row, Col, Input, Select, message } from 'antd';
import styles from './style.less';
import { getTokenBalance } from '../utils/chainHelper';

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
    console.log(value);
    let tokenAddress = "";
    if (value === 'Custom Token') {
      this.setState({ tokenSymbol: value, tokenAddressDisable: false, tokenAddress, loading: true, amountDisable: true }); //TODO: GET SYMBOL
    } else {
      tokenAddress = (tokenList.find((v, i) => { return v.symbol === value })).tokenAddress;
      this.setState({ tokenSymbol: value, tokenAddressDisable: true, tokenAddress, loading: true, amountDisable: true });
    }

    this.props.updateInfo(this.state.amount, tokenAddress);

    setTimeout(async () => {
      try {
        let balance = await getTokenBalance(tokenAddress, this.props.userAddress);
        this.setState({ loading: false, balance, amountDisable: false });
      } catch (error) {
        console.log(error);
        this.setState({ loading: false });
      }
    }, 0);
  }

  onTokenAddressChange = (e) => {
    let tokenAddress = e.target.value;
    this.props.updateInfo(this.state.amount, tokenAddress);
    this.setState({ tokenAddress });

    if (tokenAddress.length === 42) {
      this.setState({ loading: true });
      this.props.updateInfo(this.state.amount, tokenAddress);
      setTimeout(async () => {
        try {
          let balance = await getTokenBalance(tokenAddress, this.props.userAddress);
          this.setState({ loading: false, balance });
        } catch (error) {
          console.log(error);
          this.setState({ loading: false });
        }
      }, 0);
    } else {
      this.setState({ loading: false, balance: "" });
    }
  }

  onTokenAmountChange = (e) => {
    let amount = e.target.value;
    if (isNaN(Number(amount))) {
      return;
    }

    if (this.state.balance) {
      if (Number(amount) > Number(this.state.balance)) {
        message.warn("Amount out of balance");
        return;
      }
    }

    this.setState({ amount });
    this.props.updateInfo(amount, this.state.tokenAddress);
  }

  render() {
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
              <Select style={{ width: "424px" }} onChange={this.onChange} value={this.state.tokenSymbol}>
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
              <Input disabled={this.state.tokenAddressDisable} value={this.state.tokenAddress} onChange={this.onTokenAddressChange} />
            </Row>
            <Row>
              <Input disabled={true} value={this.props.userAddress} />
            </Row>
            <Row>
              <Search disabled={true} value={this.state.balance} loading={this.state.loading} />
            </Row>
            <Row>
              <Input disabled={this.props.verify || this.state.amountDisable} value={this.state.amount} onChange={this.onTokenAmountChange} suffix={this.state.tokenSymbol} />
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TokenInfo;