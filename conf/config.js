
export const mainnetDexSCAddr = '0xf0ff1d294e8ce926000ff2cb0a171ca434a5af16';//mainnet
export const testnetDexSCAddr = '0x8786038ef9c2f659772c6c2ee8402bdfdc511bb8';//testnet 

export const mainnetProxyAddr = '0xff6d4cca7509573faa92013496399b82760cf269'; //mainnet
export const testnetProxyAddr = '0x9e57b9f1d836ff1701e441a619cbaad7fc8863d3'; //testnet

// change networkId to switch network
export const networkId = 3; //1:mainnet, 3:testnet;

export const nodeUrl = networkId == 1 ? "wss://api.wanchain.org:8443/ws/v3/2d044687a34aa9bf2eee7ab4fe61044f7962bb06e188ddaaedfd45f793fab837" : "wss://apitest.wanchain.org:8443/ws/v3/2d044687a34aa9bf2eee7ab4fe61044f7962bb06e188ddaaedfd45f793fab837";
