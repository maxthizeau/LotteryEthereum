# 🏗 Lotty

> 🚀 Lottery dApp using [Scaffold Eth](https://github.com/scaffold-eth/scaffold-eth) components/hooks, and [Scaffold Eth Typescript](https://github.com/scaffold-eth/scaffold-eth-typescript)

> 👨‍🎨 Since I'm not a great web designer, the design I used is inspired by [Raydium](https://raydium.io/)

# 🔍 Features

**How does the lottery works ?**

First, you need Lotty Token to buy a ticket. There is a Swap page where you can mint Lotty Token for 0.005 ETH.

Then, you can use them to buy a ticket. This is a two steps process :

- 1. Approve the amount of LTY, knowing that 1 LTY will gives you 1 lottery ticket. _This will allow the contract to spend the amount of LTY token you approved to give you lottery ticket(s)._
- 2. Buy ticket(s) after successful approval.

> Why not just use Ether as lottery currency so we don't need allowance before ticket buy ?

Honestly, it would be better for the user if there were no LTY token, and only use ETH. But since I've done this project just to learn new things and I've never created ERC20 before, I wanted to try this here. I might add a staking feature in the future to give it a little more sense.

Once the timer reach 0, everyone can draw lottery numbers and start a new round. (More informations about it below)

You can verify the result in the "Result" page, and claim rewards if you have at least 1 winning ticket.

You can find more information on the "How to play" page.

## Lottery

![image](https://user-images.githubusercontent.com/32738472/147385562-9bccb5df-9583-4a4b-96b4-32b74486f1a3.png

- Buy Tickets

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/austintgriffith/scaffold-eth.git
```

> install and start your 👷‍ Hardhat chain:

```bash
cd scaffold-eth
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd scaffold-eth
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd scaffold-eth
yarn deploy
```

🔏 Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`

📝 Edit your frontend `App.jsx` in `packages/react-app/src`

💼 Edit your deployment scripts in `packages/hardhat/deploy`

📱 Open http://localhost:3000 to see the app

# 📚 Documentation

Documentation, tutorials, challenges, and many more resources, visit: [docs.scaffoldeth.io](https://docs.scaffoldeth.io)

# 🔭 Learning Solidity

📕 Read the docs: https://docs.soliditylang.org

📚 Go through each topic from [solidity by example](https://solidity-by-example.org) editing `YourContract.sol` in **🏗 scaffold-eth**

- [Primitive Data Types](https://solidity-by-example.org/primitives/)
- [Mappings](https://solidity-by-example.org/mapping/)
- [Structs](https://solidity-by-example.org/structs/)
- [Modifiers](https://solidity-by-example.org/function-modifier/)
- [Events](https://solidity-by-example.org/events/)
- [Inheritance](https://solidity-by-example.org/inheritance/)
- [Payable](https://solidity-by-example.org/payable/)
- [Fallback](https://solidity-by-example.org/fallback/)

📧 Learn the [Solidity globals and units](https://solidity.readthedocs.io/en/v0.6.6/units-and-global-variables.html)

# 🛠 Buidl

Check out all the [active branches](https://github.com/austintgriffith/scaffold-eth/branches/active), [open issues](https://github.com/austintgriffith/scaffold-eth/issues), and join/fund the 🏰 [BuidlGuidl](https://BuidlGuidl.com)!

- 🚤 [Follow the full Ethereum Speed Run](https://medium.com/@austin_48503/%EF%B8%8Fethereum-dev-speed-run-bd72bcba6a4c)

- 🎟 [Create your first NFT](https://github.com/austintgriffith/scaffold-eth/tree/simple-nft-example)
- 🥩 [Build a staking smart contract](https://github.com/austintgriffith/scaffold-eth/tree/challenge-1-decentralized-staking)
- 🏵 [Deploy a token and vendor](https://github.com/austintgriffith/scaffold-eth/tree/challenge-2-token-vendor)
- 🎫 [Extend the NFT example to make a "buyer mints" marketplace](https://github.com/austintgriffith/scaffold-eth/tree/buyer-mints-nft)
- 🎲 [Learn about commit/reveal](https://github.com/austintgriffith/scaffold-eth/tree/commit-reveal-with-frontend)
- ✍️ [Learn how ecrecover works](https://github.com/austintgriffith/scaffold-eth/tree/signature-recover)
- 👩‍👩‍👧‍👧 [Build a multi-sig that uses off-chain signatures](https://github.com/austintgriffith/scaffold-eth/tree/meta-multi-sig)
- ⏳ [Extend the multi-sig to stream ETH](https://github.com/austintgriffith/scaffold-eth/tree/streaming-meta-multi-sig)
- ⚖️ [Learn how a simple DEX works](https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90)
- 🦍 [Ape into learning!](https://github.com/austintgriffith/scaffold-eth/tree/aave-ape)

# 💌 P.S.

🌍 You need an RPC key for production deployments/Apps, create an [Alchemy](https://www.alchemy.com/) account and replace the value of `ALCHEMY_KEY = xxx` in `packages/react-app/src/constants.js`

### Automated with Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#github.com/scaffold-eth/scaffold-eth)\*\*\*\*

# 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

---

🙏 Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!
