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

describe('Lottery', function () {
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
    chainlinkConfig.linkToken = linkToken.address;
    chainlinkConfig.vrfCoordinator = vrfCoordinator.address;
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

  const getLTYBalanceOf = async (address: string) => {
    return await token.balanceOf(address);
  };

  const buyTickets = async (amount: number, to: SignerWithAddress) => {
    await contract.connect(to).buyLottyToken({ value: ticketPrice.mul(amount) });
    // console.log(formatEther((await token.balanceOf(to.address)).toString()));
    await token.connect(to).approve(contract.address, parseEther(amount.toString()));
    // console.log(formatEther((await token.allowance(to.address, contract.address)).toString()));
    await contract.connect(to).buyMultipleRandomTicket(amount);
  };

  it('should set the right owner', async function () {
    expect(await contract.owner()).to.equal(owner.address);
  });

  it('should return the base price of a ticket (0.005)', async function () {
    const ticketPrice = (await contract.ticketPrice()).toString();
    expect(formatEther(ticketPrice)).to.equal('0.005');
  });

  // should create an empty draw after deployment with id of 0
  it('should create an empty draw after deployment with id of 0', async function () {
    const draw1 = await contract.draws(0);
    expect(draw1).to.exist;
    await expect(contract.draws(1)).to.be.reverted;
  });
  // should transfer ownership to Alice
  it('should transfer ownership to Alice', async function () {
    expect(await contract.owner()).to.be.equal(owner.address);
    await contract.transferOwnership(alice.address, { from: owner.address });
    expect(await contract.owner()).to.be.equal(alice.address);
  });

  // Buy Ticket :
  // should return a tickets array length of 1 when user buy a ticket
  it('should return a tickets array length of 1 when user buy a ticket', async () => {
    // tickets[0] should not exist yet
    await expect(contract.tickets(0)).to.be.reverted;
    const ticketPrice = await contract.ticketPrice();
    // Alice buys one ticket
    await buyTickets(1, alice);
    //tickets[0] should now exist
    expect(await contract.tickets(0)).to.exist;
    await expect(contract.tickets(1)).to.be.reverted;
    //ticketToOwner[0] should now be alice's address
    expect(await contract.ticketToOwner(0)).to.be.equal(alice.address);
  });

  // should return a draw tickets array length of 1 when user buy a ticket
  it('should return a draw tickets array length of 1 when user buy a ticket', async () => {
    // Ticket should not exist in draw yet
    await expect(contract.drawToTickets(0, 0)).to.be.reverted;

    await buyTickets(1, alice);
    expect(contract.drawToTickets(0, 0)).to.exist;
  });

  // Draw :
  // should increase the lottery count and create new draw after a draw
  it('should increase the lottery count and create new draw after a draw', async () => {
    expect(await contract.lotteryCount()).to.be.equal(0);
    await network.provider.send('evm_increaseTime', [3600 * 12]);
    await network.provider.send('evm_mine');
    const draw = await contract.draw();
    await expect(contract.draws(1)).to.not.be.reverted;
    expect(await contract.lotteryCount()).to.be.equal(1);
  });
  // should not be able to draw before delay time
  it('should not be able to draw before delay time', async () => {
    const draw1 = await contract.draw();
    await expect(contract.draws(1)).to.be.reverted;
  });
  // should be able to draw after delay time
  it('should be able to draw after delay time', async () => {
    await network.provider.send('evm_increaseTime', [3600 * 12]);
    await network.provider.send('evm_mine');
    const draw = await contract.draw();
    await expect(contract.draws(1)).to.not.be.reverted;
  });
  // should increase devFee balance after a draw
  it('should increase devFee balance after a draw', async () => {
    expect((await contract._getAllBalances())[2]).to.be.equal('0');
    // Buy tickets
    await buyTickets(2, alice);
    await buyTickets(2, bob);

    await network.provider.send('evm_increaseTime', [3600 * 12]);
    await network.provider.send('evm_mine');

    await contract.draw();
    const draw = await contract.draws(0);
    expect((await contract._getAllBalances())[2]).to.not.be.equal('0');
  });

  // Claim :
  // user should not be able to claim and get rewards twice
  it('should not be able to claim and get rewards twice', async () => {
    // Buy tickets
    await buyTickets(20, alice);

    await network.provider.send('evm_increaseTime', [3600 * 12]);
    await network.provider.send('evm_mine');

    await contract.draw();
    const draw = await contract.draws(0);
    const balanceBeforeClaim = await getLTYBalanceOf(alice.address);
    const claimableBalanceOfAlice = await contract.getClaimableAmountOfAddress(alice.address);
    if (claimableBalanceOfAlice !== BigNumber.from(0)) {
      // First claim
      const allBalancesBeforeClaim = await contract._getAllBalances();
      expect(allBalancesBeforeClaim[1].gt(0)).to.be.true;
      await contract.connect(alice).claim();
      const balanceAfterClaim = await getLTYBalanceOf(alice.address);
      expect(balanceBeforeClaim.lt(balanceAfterClaim), "Alice's balance before claim should be less than after claim").to.be.true;
      const allBalancesAfterFirstClaim = await contract._getAllBalances();
      expect(allBalancesAfterFirstClaim[1].eq(0), `Claimable balance should be 0 after claim. Found ${formatEther(allBalancesAfterFirstClaim[1])}`).to.be.true;
      await contract.connect(alice).claim();
      const allBalancesAfterSecondClaim = await contract._getAllBalances();

      // 2 successive claims should not change any of the contract balances
      for (let i = 0; i < allBalancesAfterFirstClaim.length; i++) {
        // console.log(`${formatEther(allBalancesAfterFirstClaim[i])} = ${formatEther(allBalancesAfterSecondClaim[i])}`);
        expect(allBalancesAfterFirstClaim[i].eq(allBalancesAfterSecondClaim[i])).to.be.true;
      }
    }
  });
  // should reduce the claimable balance after user claimed rewards

  // Dev Fee :
  // should withdraw devFee to owner
  it('should withdraw devFee to owner', async function () {
    // Buy tickets and draw
    await buyTickets(10, alice);

    await buyTickets(10, bob);

    await network.provider.send('evm_increaseTime', [3600 * 12]);
    await network.provider.send('evm_mine');
    await contract.draw();

    const ltyOwnerBalanceBeforeWithdraw = await getLTYBalanceOf(owner.address);
    const ethOwnerBalanceBeforeWithdraw = await owner.getBalance();
    await contract.connect(owner).withdraw();
    const ltyOwnerBalanceAfterWithdraw = await getLTYBalanceOf(owner.address);
    const ethOwnerBalanceAfterWithdraw = await owner.getBalance();

    // LTY
    expect(ltyOwnerBalanceBeforeWithdraw.lt(ltyOwnerBalanceAfterWithdraw)).to.be.true;
    // ETH (from the token sale)
    expect(ethOwnerBalanceBeforeWithdraw.lt(ethOwnerBalanceAfterWithdraw)).to.be.true;
  });
  // should revert when Alice tries to withdraw devFee
  it('should revert when Alice tries to withdraw devFee', async function () {
    await expect(contract.connect(alice).withdraw()).to.be.reverted;
  });
});
