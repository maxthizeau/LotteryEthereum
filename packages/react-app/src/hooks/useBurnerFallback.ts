/* eslint-disable eqeqeq */
import { useEthersContext } from 'eth-hooks/context'
import {
  useBurnerSigner,
  // useGetUserFromProviders,
  // useGetUserFromSigners,
  useUserAddress,
} from 'eth-hooks'
// import { parseProviderOrSigner } from 'eth-hooks/functions'
import { TEthersProvider } from 'eth-hooks/models'
import { useEffect } from 'react'
import { IScaffoldAppProviders } from 'src/hooks/useScaffoldAppProviders'

import { localNetworkInfo } from 'src/config/providersConfig'

export const useBurnerFallback = (
  appProviders: IScaffoldAppProviders,
  enable: boolean
): void => {
  const ethersContext = useEthersContext()
  const burnerFallback = useBurnerSigner(
    appProviders.localProvider as TEthersProvider
  )
  const localAddress = useUserAddress(appProviders.localProvider.getSigner())

  useEffect(() => {
    console.log('Burner fallback')
    /**
     * if the current provider is local provider then use the burner fallback
     */
    if (
      burnerFallback.account != ethersContext.account &&
      ethersContext.chainId == localNetworkInfo.chainId &&
      ethersContext.ethersProvider?.connection.url ===
        localNetworkInfo.rpcUrl &&
      burnerFallback.signer &&
      enable
    ) {
      ethersContext.changeSigner?.(burnerFallback.signer)
    }
  }, [
    ethersContext.account,
    localAddress,
    ethersContext.changeSigner,
    burnerFallback.signer,
    burnerFallback.account,
    enable,
    ethersContext,
  ])
}
