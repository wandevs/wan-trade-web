import { nodeUrl, testnetDexSCAddr, mainnetDexSCAddr, mainnetProxyAddr, testnetProxyAddr, networkId } from "../conf/config";
import Web3 from 'web3';
import erc20abi from '../conf/erc20abi.json';
import dexAbi from '../conf/dexAbi.json';
import { message } from 'antd';
import { getSelectedAccountWallet, getTransactionReceipt, getContract } from 'wan-dex-sdk-wallet';
import sleep from 'ko-sleep';
import BigNumber from 'bignumber.js';
import { sha3, ecrecover, hashPersonalMessage, toBuffer, pubToAddress } from 'ethereumjs-util';

let web3;

if (nodeUrl.indexOf('ws') === 0) {
  web3 = new Web3(new Web3.providers.WebsocketProvider(nodeUrl));
} else {
  web3 = new Web3(new Web3.providers.HttpProvider(nodeUrl));
}

let dexScAddr = networkId === 1 ? mainnetDexSCAddr : testnetDexSCAddr;
let dexContract = new web3.eth.Contract(dexAbi, dexScAddr);

let proxyAddr = networkId === 1 ? mainnetProxyAddr : testnetProxyAddr;


export const getTokenBalance = async (tokenAddress, userAddress) => {
  let erc20sc = new web3.eth.Contract(erc20abi, tokenAddress);
  let balance = await erc20sc.methods.balanceOf(userAddress).call();
  let decimals = await erc20sc.methods.decimals().call();

  if (Number(decimals) === 18) {
    return web3.utils.fromWei(balance);
  } else {
    if (Number(decimals) === 0) {
      throw new Error("Get decimals zero");
    }
    return Number(balance) / Number(Math.pow(10, decimals));
  }
};

export const getApproveState = async (tokenAddress, userAddress) => {
  let erc20sc = new web3.eth.Contract(erc20abi, tokenAddress);
  let allowance = await erc20sc.methods.allowance(userAddress, proxyAddr).call();
  return Number(allowance) > 10 ** 30;
}

export const enable = async (address, wallet) => {
  let ret = await approve(address, '', 'f000000000000000000000000000000000000000000000000000000000000000', 'Enable', wallet);
  return ret;
};

export const disable = async (address, wallet) => {
  let ret = await approve(address, '', '0000000000000000000000000000000000000000000000000000000000000000', 'Disable', wallet);
  return ret;
};

export const approve = async (tokenAddress, symbol, allowance, action, wallet) => {
  const functionSelector = '095ea7b3';
  let spender = get64BytesString(proxyAddr);
  if (spender.length !== 64) {
    return null;
  }

  let params = {
    to: tokenAddress,
    data: `0x${functionSelector}${spender}${allowance}`,
    value: 0
  };

  try {
    const txID = await wallet.sendTransaction(params);

    message.info(`${action} ${symbol} request submitted`);

    let times = 30;
    while (times > 0) {
      const tx = await getTransactionReceipt(txID);
      if (!tx) {
        await sleep(5000);
        times--;
      } else {
        message.info('success');
        return true;
      }
    }
    message.error(action + " failed");
    return false;
  } catch (e) {
    message.error(e.toString());
  }
  return false;
};

const get64BytesString = string => {
  string = string.replace('0x', '');
  while (string.length < 64) {
    string = '0'.concat(string);
  }
  return string;
};

const getOrderSignature = async (order, exchange, baseToken, quoteToken) => {
  const copyedOrder = JSON.parse(JSON.stringify(order));
  copyedOrder.baseToken = baseToken;
  copyedOrder.quoteToken = quoteToken;

  const orderHash = getOrderHash(copyedOrder);
  const newWeb3 = getWeb3();

  // This depends on the client, ganache-cli/testrpc auto prefix the message header to message
  // So we have to set the method ID to 0 even through we use web3.eth.sign
  const signature = fromRpcSig(await newWeb3.eth.sign(orderHash, order.trader));
  signature.config = `0x${signature.v.toString(16)}00` + '0'.repeat(60);
  const isValid = isValidSignature(order.trader, signature, orderHash);

  assert.equal(true, isValid);
  order.signature = signature;
  order.orderHash = orderHash;
};

export const buildOrder = async (orderParam, exchange, baseTokenAddress, quoteTokenAddress) => {
  const order = {
      trader: orderParam.trader,
      relayer: orderParam.relayer,
      data: generateOrderData(
          orderParam.version,
          orderParam.side === 'sell',
          orderParam.type === 'market',
          orderParam.expiredAtSeconds,
          orderParam.asMakerFeeRate,
          orderParam.asTakerFeeRate,
          orderParam.makerRebateRate || '0',
          Math.round(Math.random() * 10000000)
      ),
      baseTokenAmount: orderParam.baseTokenAmount,
      quoteTokenAmount: orderParam.quoteTokenAmount,
      gasTokenAmount: orderParam.gasTokenAmount
  };

  await getOrderSignature(order, exchange, baseTokenAddress, quoteTokenAddress);

  return order;
};

const generateOrderData = (
  version,
  isSell,
  isMarket,
  expiredAtSeconds,
  asMakerFeeRate,
  asTakerFeeRate,
  makerRebateRate,
  salt,
  isMakerOnly
) => {
  let res = '0x';
  res += addLeadingZero(new BigNumber(version).toString(16), 2);
  res += isSell ? '01' : '00';
  res += isMarket ? '01' : '00';
  res += addLeadingZero(new BigNumber(expiredAtSeconds).toString(16), 5 * 2);
  res += addLeadingZero(new BigNumber(asMakerFeeRate).toString(16), 2 * 2);
  res += addLeadingZero(new BigNumber(asTakerFeeRate).toString(16), 2 * 2);
  res += addLeadingZero(new BigNumber(makerRebateRate).toString(16), 2 * 2);
  res += addLeadingZero(new BigNumber(salt).toString(16), 8 * 2);
  res += isMakerOnly ? '01' : '00';

  return addTailingZero(res, 66);
};

const addLeadingZero = (str, length) => {
  let len = str.length;
  return '0'.repeat(length - len) + str;
};

const addTailingZero = (str, length) => {
  let len = str.length;
  return str + '0'.repeat(length - len);
};

const isValidSignature = (account, signature, message) => {
  let pubkey;
  const v = parseInt(signature.config.slice(2, 4), 16);
  const method = parseInt(signature.config.slice(4, 6), 16);
  if (method === 0) {
      pubkey = ecrecover(
          hashPersonalMessage(toBuffer(message)),
          v,
          toBuffer(signature.r),
          toBuffer(signature.s)
      );
  } else if (method === 1) {
      pubkey = ecrecover(toBuffer(message), v, toBuffer(signature.r), toBuffer(signature.s));
  } else {
      throw new Error('wrong method');
  }

  const address = '0x' + pubToAddress(pubkey).toString('hex');
  return address.toLowerCase() == account.toLowerCase();
};

const sha3ToHex = message => {
  return '0x' + sha3(message).toString('hex');
};

const EIP712_DOMAIN_TYPEHASH = sha3ToHex('EIP712Domain(string name)');
const EIP712_ORDER_TYPE = sha3ToHex(
    'Order(address trader,address relayer,address baseToken,address quoteToken,uint256 baseTokenAmount,uint256 quoteTokenAmount,uint256 gasTokenAmount,bytes32 data)'
);

const getDomainSeparator = () => {
  return sha3ToHex(EIP712_DOMAIN_TYPEHASH + sha3ToHex('Hydro Protocol').slice(2));
};

const getEIP712MessageHash = message => {
  return sha3ToHex('0x1901' + getDomainSeparator().slice(2) + message.slice(2), {
      encoding: 'hex'
  });
};

const getOrderHash = order => {
  return getEIP712MessageHash(
      sha3ToHex(
          EIP712_ORDER_TYPE +
              addLeadingZero(order.trader.slice(2), 64) +
              addLeadingZero(order.relayer.slice(2), 64) +
              addLeadingZero(order.baseToken.slice(2), 64) +
              addLeadingZero(order.quoteToken.slice(2), 64) +
              addLeadingZero(new BigNumber(order.baseTokenAmount).toString(16), 64) +
              addLeadingZero(new BigNumber(order.quoteTokenAmount).toString(16), 64) +
              addLeadingZero(new BigNumber(order.gasTokenAmount).toString(16), 64) +
              order.data.slice(2)
      )
  );
};

