import { DeployFunction } from 'hardhat-deploy/types';
import { parseEther } from 'ethers/lib/utils';
import { HardhatRuntimeEnvironmentExtended } from 'helpers/types/hardhat-type-extensions';
import { ethers } from 'hardhat';
import { CHAINLINK_NETWORKS } from 'helpers/chainlink_networks';
import { BigNumber } from 'ethers';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironmentExtended) => {
  const { getNamedAccounts, deployments } = hre as any;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainlinkConfig = CHAINLINK_NETWORKS[hre.network.name];
  const lottery = await ethers.getContract('Lottery', deployer);
  console.log(`Lottery Contract : ${lottery.address}`);
  console.log(`ChainLink Config for ${hre.network.name}`);

  // Deploy Mock ERC20 & Coordinator if localhost
  if (hre.network.name == 'localhost') {
    console.log('Localhost detected : using Mock ERC20 and VRF Coordinator (to use Chainlink VRF)');
    // Deploy Link Token
    const linkToken = await deploy('Mock_ERC20', {
      from: deployer,
      args: [parseEther('100000')],
      log: true,
    });

    // Deploy VRF Coordinator
    const vrfCoordinator = await deploy('Mock_VRFCoordinator', {
      from: deployer,
      args: [linkToken.address, chainlinkConfig.keyHash, BigNumber.from(chainlinkConfig.fee)],
      log: true,
    });
    chainlinkConfig.linkToken = linkToken.address;
    chainlinkConfig.vrfCoordinator = vrfCoordinator.address;

    console.log('Deployed Link Token at', linkToken.address);
    console.log('Deployed VRF Coordinator at', vrfCoordinator.address);
  }
  console.log(chainlinkConfig.vrfCoordinator, chainlinkConfig.linkToken, chainlinkConfig.keyHash, BigNumber.from(chainlinkConfig.fee), lottery.address);

  console.log(`Gas price : ${hre.network.config.gasPrice}`);
  await deploy('RandomNumberGenerator', {
    from: deployer,
    args: [chainlinkConfig.vrfCoordinator, chainlinkConfig.linkToken, chainlinkConfig.keyHash, BigNumber.from(chainlinkConfig.fee), lottery.address],
    log: true,
  });

  // await randomGenerator.deployed();
  console.log('Change Lottery RNG..');
  const randomGenerator = await ethers.getContract('RandomNumberGenerator', deployer);
  await lottery.setRandomNumberGenerator(randomGenerator.address);

  if (hre.network.name == 'localhost') {
    console.log('Sending LINK token to randomGenerator contract');
    const link = await ethers.getContract('Mock_ERC20', deployer);
    await link.transfer(randomGenerator.address, parseEther('1000'));
  } else {
    console.log('Not deployed on localhost : you need to manually fund randomGenerator contract with LINK');
  }

  console.log('Deployed Random Generator at', randomGenerator.address);
};
export default func;
func.tags = ['RandomNumberGenerator', 'vrf'];
