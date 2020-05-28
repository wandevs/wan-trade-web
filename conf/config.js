
export const mainnetSCAddrWan2Btc = '0xdfad0145311acb8f0e0305aceef5d11a05df9aa0';//mainnet
export const testnetSCAddrWan2Btc = '0x6e1f4097ec38965256a17a9c8ed3ef38162647ad';//testnet 

export const mainnetSCAddrBtc2Usd = '0x68f7ac0a94c553d86a606abd115e2128750335e1';//mainnet
export const testnetSCAddrBtc2Usd = '0x95be29f63fc312e57bda53f0e2c92aff791fdf4c';//testnet 

export const mainnetSCAddrEth2Usd = '0x9f2f486de9ce5519ac54032c66c0f9d9670f7d87';//mainnet
export const testnetSCAddrEth2Usd = '0xd796ec40644d47cc5eddb8bdb3eba13ad3dbddf2';//testnet 


// change networkId to switch network
export const networkId = 3; //1:mainnet, 3:testnet;

// export const nodeUrl = networkId == 1 ? "https://gwan-ssl.wandevs.org:56891" : "http://192.168.1.179:54320";
// export const nodeUrl = networkId == 1 ? "https://gwan-ssl.wandevs.org:56891" : "https://molin.tech:16666";
export const nodeUrl = networkId == 1 ? "wss://api.wanchain.org:8443/ws/v3/2d044687a34aa9bf2eee7ab4fe61044f7962bb06e188ddaaedfd45f793fab837" : "wss://apitest.wanchain.org:8443/ws/v3/2d044687a34aa9bf2eee7ab4fe61044f7962bb06e188ddaaedfd45f793fab837";
// export const nodeUrl = networkId == 1 ? "https://mywanwallet.io/api" : "https://demodex.wandevs.org:48545";

// export const nodeUrl = networkId == 1 ? "https://gwan-ssl.wandevs.org:56891" : "https://demodex.wandevs.org:48545";
