import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signers';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { formatEther, formatUnits, parseEther } from '@ethersproject/units';
import { Lottery } from 'helpers/types/contract-types';
import { BigNumber } from '@ethersproject/bignumber';
import { LottyToken } from '../helpers/types/contract-types/LottyToken';
import { CHAINLINK_NETWORKS } from '../helpers/chainlink_networks';
import { MockERC20 } from '../helpers/types/contract-types/MockERC20';
import { RandomNumberGenerator } from '../helpers/types/contract-types/RandomNumberGenerator';

xdescribe('LotteryTokenInteraction', function () {
  let owner: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress;
  let Lottery: ContractFactory;
  let LottyToken: ContractFactory;
  let LinkERC20: ContractFactory;
  let VRFCoordinator: ContractFactory;
  let RandomNumberGenerator: ContractFactory;
  let contract: Lottery;
  let token: LottyToken;
  let ticketPrice: BigNumber;

  this.beforeAll(async () => {
    // [owner, alice, bob] = await ethers.getSigners();
  });
  this.beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();

    // Contracts
    LottyToken = await ethers.getContractFactory('LottyToken');
    Lottery = await ethers.getContractFactory('Lottery');
    LinkERC20 = await ethers.getContractFactory('Mock_ERC20');
    VRFCoordinator = await ethers.getContractFactory('Mock_VRFCoordinator');
    RandomNumberGenerator = await ethers.getContractFactory('RandomNumberGenerator');

    token = (await LottyToken.deploy(owner.address, 1000)) as LottyToken;
    await token.deployed();

    contract = (await Lottery.deploy(token.address)) as Lottery;
    await contract.deployed();

    await token.connect(owner).setupRolesForAddress(contract.address);

    // VRF
    const chainlinkConfig = CHAINLINK_NETWORKS.localhost;

    const linkToken = (await LinkERC20.deploy(parseEther('100000'))) as MockERC20;
    const vrfCoordinator = await VRFCoordinator.deploy(linkToken.address, chainlinkConfig.keyHash, BigNumber.from(chainlinkConfig.fee));
    const randomNumberGenerator = (await RandomNumberGenerator.deploy(
      chainlinkConfig.vrfCoordinator,
      chainlinkConfig.linkToken,
      chainlinkConfig.keyHash,
      chainlinkConfig.fee,
      contract.address
    )) as RandomNumberGenerator;

    await contract.connect(owner).setRandomNumberGenerator(randomNumberGenerator.address);
    await linkToken.connect(owner).transfer(randomNumberGenerator.address, parseEther('1000'));

    ticketPrice = await contract.ticketPrice();
  });

  const showBalances = async () => {
    const ownerBalance = await token.balanceOf(owner.address);
    const aliceBalance = await token.balanceOf(alice.address);
    const contractBalance = await token.balanceOf(contract.address);
    console.log('owner balance : ', ownerBalance.toString());
    console.log('alice balance : ', aliceBalance.toString());
    console.log('contract balance : ', contractBalance.toString());
  };
  it('should test randomness of genereated numbers', async function () {
    // Very long test, to ensure every number is picked approx. the same amount of time
    // Takes ~35 minutes to run
    this.timeout(50000000);
    await contract.connect(alice).buyLottyToken({ value: ticketPrice.mul(50000) });
    await token.connect(alice).approve(contract.address, parseEther('50000'));
    const result = new Array(26).fill(0);
    const ticketCount = 50000;
    // let gasUsed = BigNumber.from(0);
    for (let i = 0; i < ticketCount; i++) {
      if (i % 500 === 0) {
        console.log('Tickets bought : ', i);
      }
      // Tested : Faster to buy one by one than 100 by 100
      const res = await contract.connect(alice).buyMultipleRandomTicket(1);
      const ticket = await contract.viewTicket(i);
      for (let j = 0; j < 5; j++) {
        const numbers = ticket[0][j];
        result[numbers] = result[numbers] + 1;
      }
    }

    for (let i = 1; i < result.length; i++) {
      const element = result[i];
      console.log(`Number ${i} is picked ${(element / ticketCount) * 100} % of the time`);
    }
    // console.log('Average gas cost : ', gasUsed.div(ticketCount).toString());
  });
});

// Number 1 is picked 19.983999999999998 % of the time
// Number 2 is picked 20.808 % of the time
// Number 3 is picked 22.206 % of the time
// Number 4 is picked 22.804 % of the time
// Number 5 is picked 23.878 % of the time
// Number 6 is picked 24.456 % of the time
// Number 7 is picked 23.528 % of the time
// Number 8 is picked 23.398 % of the time
// Number 9 is picked 22.482 % of the time
// Number 10 is picked 21.848 % of the time
// Number 11 is picked 21.546000000000003 % of the time
// Number 12 is picked 20.922 % of the time
// Number 13 is picked 20.094 % of the time
// Number 14 is picked 19.886 % of the time
// Number 15 is picked 19.532 % of the time
// Number 16 is picked 19.058 % of the time
// Number 17 is picked 18.546000000000003 % of the time
// Number 18 is picked 17.919999999999998 % of the time
// Number 19 is picked 18.099999999999998 % of the time
// Number 20 is picked 17.522 % of the time
// Number 21 is picked 16.952 % of the time
// Number 22 is picked 16.784 % of the time
// Number 23 is picked 16.398 % of the time
// Number 24 is picked 15.83 % of the time
// Number 25 is picked 15.518 % of the time
