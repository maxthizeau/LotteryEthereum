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

### Lottery

![image](https://user-images.githubusercontent.com/32738472/147385562-9bccb5df-9583-4a4b-96b4-32b74486f1a3.png)

- Buy Tickets
- Current round rewards
- See your tickets for the current round
- Draw lottery when ready

When drawing lottery result, tx might fail every other time. If you're facing this issue, you can increase the gas limit of the tx to fix this.

### Results

![image](https://user-images.githubusercontent.com/32738472/147385741-3e80ff1e-3eb5-432c-8c3c-21f8c6b232de.png)

- See previous rounds numbers/tickets/rewards
- Claim your rewards

_TODO : Prevent block gas limit and improve gas optimization. When a user claims rewards, the contract will check all user tickets since previous claim. Instead of doing that, it would be better if you can claim a specific ticket or a given ticket array (of a maximum 50 or 100 tickets). By doing that, we can verify all tickets in frontend using view functions, and only verify and claim winning tickets when the user makes the claim transaction._
_It also prevent a potential block gas limit issue. This has not been tested yet but I believe if a very rich user tries to claim millions of tickets, the tx would be too big and the user couldn't withdraw his reward._

### Swap

![image](https://user-images.githubusercontent.com/32738472/147385991-e06d02d6-c6c3-42ae-8cf6-440b5f4f65bb.png)

Mint LTY at the price of 0.005 ETH / each.

You can't sell LTY for ETH there.

This swap feature has been made for testing and local development. On mainnet, it would be better to create a LTY/ETH pair on Uniswap.

### Owner page

![image](https://user-images.githubusercontent.com/32738472/147386003-6fc0602b-bc40-40f9-a0d7-0ebeaa01c171.png)

- Withdraw dev fees
- Burn LTY
- Fund next lottery
- Update random number generator address
- Update fee/keyhash of current RNG address

TODO : Restrict the access of the owner page. For the time being, only nav link is hidden from user.

# 🏄‍♂️ Quick Start

Prerequisites: [Node](https://nodejs.org/en/download/) plus [Yarn](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork 🏗 scaffold-eth:

```bash
git clone https://github.com/maxthizeau/LotteryEthereum.git
```

> edit chain for 'localhost' on packages/hardhat/hardhat.config.ts and packages/react-app/congif/providersConfig.ts
> or generate account `yarn generate` and fund it with ether on Kovan Testnet

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

📱 Open http://localhost:3000 to see the app

# 📚 A word on this project

To be honest, it is not production ready. And I think it will never be.
This is my first fullstack dApp and I've made it just for learning purpose.

Since it's my first dApp, it is certain that there are security issues and vulnerabilities. I'm planning to train security next, by doing all Ethernaut challenges and other CTF I find. After that, I might come back to this Lottery Project and try to exploit it myself.

In the future, I migth deploy it on mainnet (probably on Polygon) so I can try to interract with Uniswap contracts, and experiment the full process of releasing a dApp on a mainnet, even if it still has bugs or vulnerabilities.
