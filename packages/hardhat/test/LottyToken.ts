import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signers';
import { expect } from 'chai';
import { ethers, network } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { formatEther, parseEther } from '@ethersproject/units';
import { LottyToken } from '../helpers/types/contract-types/LottyToken';

describe('LottyToken', function () {
  let owner: SignerWithAddress, alice: SignerWithAddress, bob: SignerWithAddress;
  let LottyToken: ContractFactory;
  let token: LottyToken;

  this.beforeAll(async () => {
    // [owner, alice, bob] = await ethers.getSigners();
  });
  this.beforeEach(async () => {
    [owner, alice, bob] = await ethers.getSigners();
    LottyToken = await ethers.getContractFactory('LottyToken');
    token = (await LottyToken.deploy(owner.address, parseEther('1000'))) as LottyToken;
    await token.deployed();
  });
  it('should mint 1000 LTY to owner', async function () {
    // // const ownerBalance = await token.balanceOf(owner.address);
    // // const minterRole = await token.MINTER_ROLE();
    // // const adminRole = await token.DEFAULT_ADMIN_ROLE();
    // // console.log('Minter role : ', minterRole);
    // // let hasRoleMinter = await token.hasRole(minterRole, owner.address);
    // // let hasRoleAdmin = await token.hasRole(adminRole, owner.address);
    // // console.log('has role minter', hasRoleMinter);
    // // console.log('has role admin', hasRoleAdmin);
    // // hasRoleMinter = await token.hasRole(minterRole, alice.address);
    // // console.log('has role minter alice', hasRoleMinter);
    // // await token.connect(owner).setupRolesForContract(alice.address);
    // // hasRoleMinter = await token.hasRole(minterRole, alice.address);
    // console.log('has role minter alice', hasRoleMinter);
    // expect(ownerBalance.eq(parseEther('1000'))).to.be.true;
  });
});
