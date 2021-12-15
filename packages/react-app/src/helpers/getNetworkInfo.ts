import { TNetworkInfo } from 'eth-hooks/models'
import { TNetworkNames, NETWORKS } from 'src/config/constants'

export const getNetworkInfo = (
  chainId: number | undefined
): TNetworkInfo | undefined => {
  if (!chainId) return

  for (const n in NETWORKS) {
    const names = n as TNetworkNames
    if (NETWORKS[names].chainId === chainId) {
      return NETWORKS[names]
    }
  }
  return
}
