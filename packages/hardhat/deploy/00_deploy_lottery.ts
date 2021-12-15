import { DeployFunction } from 'hardhat-deploy/types';
import { parseEther } from 'ethers/lib/utils';
import { HardhatRuntimeEnvironmentExtended } from 'helpers/types/hardhat-type-extensions';
import { ethers } from 'hardhat';
import { LottyToken } from '../helpers/types/contract-types/LottyToken';
import { Lottery } from '../../react-app/src/generated/contract-types/Lottery';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre as any;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('LottyToken', {
    from: deployer,
    args: [deployer, parseEther('1000000')],
    log: true,
  });
  const lottyToken = (await ethers.getContract('LottyToken', deployer)) as LottyToken;

  await deploy('Lottery', {
    from: deployer,
    args: [lottyToken.address],
    log: true,
  });

  const lottery = await ethers.getContract('Lottery', deployer);
  await lottyToken.setupRolesForAddress(lottery.address);
};
export default func;
func.tags = ['Lottery', 'LottyToken'];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
