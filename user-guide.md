# P2P Exchange Platform
# User Manual


[[中文版用户手册]](./user-guide_zh-CN.md)

# 1. Overview

P2PE (peer to peer exchange) is a decentralized trading DApp built on Wanchain which allows for the exchange of value between assets from multiple different blockchains.

**P2PE Features:**

    1) 0 transaction fee for all orders

    2) Ability determine the exact price and amount of currency for trade execution.

    3) All current WRC20 tokens can be traded supports the adding of new WRC20 tokens.

    4) Dual security guarantee based on both HTLC (Hash Time Locking Contract) and Token Approve.

    5) The order can be cancelled at any time before it is finalized on chain. After the cancellation, the order is no longer available and there is no delay for token withdrawal.

    6) Order transaction information is not visible through the UI, it is only visible through on-chain data.

    7) Doesn’t require sending of tokens to an online wallet of contract address prior to transaction. Transactions can be executed directly from user’s wallet (with Ledger hardware wallet support).

    8) Multi-chain and multi-currency transactions can be supported through Wanchain’s cross-chain tech.

# 2. Application Scenario

Lucy wants to buy 1,000 ETH at a unit price of 0.0248 BTC, and plans to spend a total of 24.8 BTC. If this operation is completed through an exchange, it could be difficult to complete in a single transaction – resulting in multiple transactions, transactions fees, wasted time, and likely price slippage resulting in losses. Therefore Lucy decides to buy her ETH for a fixed price in an OTC transaction. 

First Lucy posts an ad to her social network: 

"Buying 1,000 ETH at 0.0248 BTC/ETH"

Tom sees Lucy's post and wants to sell his ETH her, so after the two communicate and agree on the details, they decide to move forward with the transactions. 

If Tom and Lucy were to proceed using a trusted third party mediator such as a law firm it would be costly and complex. After research different methods for completing OTC transactions without a trusted third party mediator, the pair decide that P2PE is the best solution. The pair move forward with the transaction as follows:

# 3. Operation Process

**Step 1:** Lucy and Tom each download the Wanchain desktop Wallet from the Wanchain homepage. 

Download: [https://wanchain.org/getstarted](https://wanchain.org/getstarted)

![img](./img/1.png)

**Step 2:** Lucy and Tom create WAN address, ETH address and BTC address in the light wallet.

![img](./img/2.png)

![img](./img/3.png)

![img](./img/4.png)

**Step 3:** Lucy and Tom each transfer 1 WAN to their WAN addresses to pay for transaction fees 

**Step 4:** Lucy deposits his BTC to his Bitcoin address (including a small amount for transaction fees), and Tom deposits his ETH to the Ethereum address of his wanchain wallet (including a small amount for fees);

**Step 5:** Lucy and Tom each complete the cross-chain swap in the Cross Chain section of the wallet in order to convert their BTC and ETH to WBTC and WETH respectively. Both Lucy and Tom each make sure that the address where their WAN fee is stored is where they hold their WBTC and WETH WRC20 tokens.

![img](./img/5.png)

![img](./img/6.png)

![img](./img/7.png)

![img](./img/8.png)

**Step 6:** Lucy and Tom open the DApp store section of the Wallet and add the P2PE DApp to their wallet’s local DApps section.

![img](./img/9.png)

**Step 7:** Lucy and Tom open the P2PE DApp in the wallet, and select the addresses where WBTC and WETH are stored through address selector in the top right corner.

![img](./img/10.png)

![img](./img/11.png)

**Step 8:** Tom, as Party B, sends his WETH address to Lucy through his messaging app.

**Step 9:** Lucy will input the address received from Tom on the Party A page in the Party B Address input field, and fill in the Buy and Sell information carefully (selling 24.8 WBTC and buying 1,000 WETH). She will also check the Token information, including the checking that the Token Smart Contract address and the balance of the address are correct.  

![img](./img/12.png)

**Step 10:** After Lucy’s information is filled in and checked and she has selected an appropriate order timeout time, Tom must complete the subsequent steps within the timeout period, otherwise the transaction order is automatically invalid. After inputting and checking all required information Lucy clicks the Approve authorization switch below to allow the smart contract to transact with the 24.8 WBTC in Lucy’s wallet.

![img](./img/13.png)

![img](./img/14.png)

![img](./img/15.png)

**Step 11:** After Lucy completes the Approve operation, she clicks the Sign Order button below, which will generate hashed and signed order data in the field below. She will then click the Copy Data button to copy the order data and send it to Tom through a messaging app. 

![img](./img/16.png)

![img](./img/17.png)

**Step 12:** After receiving Lucy's order data, Tom pastes it into the Paste area at the top of the Party B page and clicks the Parse button.

![img](./img/18.png)

**Step 13:** Tom can see the detailed order information after clicking Parse. Tom carefully checks the amount of WETH sold and the amount of WBTC bought, carefully checks the Token contract address and account balance, and checks the order expiration time. After verifying all the information, he clicks the Approve button to grant the smart contract the right to usethe 1,000 WETH in his account.

![img](./img/19.png)

![img](./img/20.png)

**Step 14:** After the Approve operation succeeds, Tom clicks the Send to Exchange button to send the order to the smart contract for settlement. The smart contract verifies the validity of the information, balance, and signature of both parties. If everything is valid, the token exchange is completed.

![img](./img/21.png)

**Step 15:** Lucy and Tom completed the exchange of WBTC and WETH through the above steps, and can return to the wallet Cross Chain page where they can convert back to BTC and ETH respectively. At this point, the entire transaction process is complete.

# 4. Remarks

For detailed security analysis and working principle see: 

[P2P Exchange Working Principles](./P2P_Exchange_Working_Principles.md)

