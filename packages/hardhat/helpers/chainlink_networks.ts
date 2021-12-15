export interface IChailinkNetwork {
  [chainName: string]: {
    vrfCoordinator: string;
    linkToken: string;
    keyHash: string;
    fee: string;
  };
}

export const CHAINLINK_NETWORKS: IChailinkNetwork = {
  localhost: {
    vrfCoordinator: '',
    linkToken: '',
    keyHash: '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4',
    fee: '100000000000000000',
  },
  rinkeby: {
    vrfCoordinator: '0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B',
    linkToken: '0x01be23585060835e02b77ef475b0cc51aa1e0709',
    keyHash: '0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311',
    fee: '100000000000000000',
  },
  kovan: {
    vrfCoordinator: '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9',
    linkToken: '0xa36085F69e2889c224210F603D836748e7dC0088',
    keyHash: '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4',
    fee: '100000000000000000',
  },
  mainnet: {
    vrfCoordinator: '',
    linkToken: '0x514910771af9ca656af840dff83e8264ecf986ca',
    keyHash: '',
    fee: '100000000000000000',
  },
  ropsten: {
    vrfCoordinator: '',
    linkToken: '',
    keyHash: '',
    fee: '100000000000000000',
  },

  xdai: {
    vrfCoordinator: '',
    linkToken: '',
    keyHash: '',
    fee: '',
  },
  matic: {
    vrfCoordinator: '0x3d2341ADb2D31f1c5530cDC622016af293177AE0',
    linkToken: '0xb0897686c545045afc77cf20ec7a532e3120e0f1',
    keyHash: '0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da',
    fee: '100000000000000000',
  },
};
