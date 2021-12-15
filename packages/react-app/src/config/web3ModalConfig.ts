import { ICoreOptions } from 'web3modal'

import { INFURA_ID } from 'src/config/constants'

// import WalletLink from 'walletlink'
// import WalletConnectProvider from '@walletconnect/ethereum-provider'

// import { ConnectToStaticJsonRpcProvider } from 'eth-hooks/context'
// import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { localNetworkInfo } from './providersConfig'

// network: 'mainnet', // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
export const getWeb3ModalConfig = async (): Promise<Partial<ICoreOptions>> => {
  const WalletConnectProvider = (
    await import('@walletconnect/ethereum-provider')
  ).default
  const { ConnectToStaticJsonRpcProvider } = await import('eth-hooks/context')
  const { StaticJsonRpcProvider } = await import('@ethersproject/providers')

  const walletConnectEthereum = {
    package: WalletConnectProvider,
    options: {
      bridge: 'https://polygon.bridge.walletconnect.org',
      infuraId: INFURA_ID,
      rpc: {
        1: `https://mainnet.infura.io/v3/${INFURA_ID}`,
        42: `https://kovan.infura.io/v3/${INFURA_ID}`,
        100: 'https://dai.poa.network',
      },
    },
  }

  const localhostStaticConnector = {
    display: {
      logo: 'https://avatars.githubusercontent.com/u/56928858?s=200&v=4',
      name: 'BurnerWallet',
      description: '🔥 Connect to localhost with a burner wallet 🔥',
    },
    package: StaticJsonRpcProvider,
    connector: ConnectToStaticJsonRpcProvider,
    options: {
      chainId: localNetworkInfo.chainId,
      rpc: {
        [localNetworkInfo.chainId]: localNetworkInfo.rpcUrl,
      },
    },
  }

  return {
    cacheProvider: true,
    theme: 'light',
    providerOptions: {
      'custom-localhost': localhostStaticConnector,
      walletconnect: walletConnectEthereum,
    },
  }
}
