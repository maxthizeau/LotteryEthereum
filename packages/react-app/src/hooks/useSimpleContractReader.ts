import { useState, useEffect } from 'react'
import { BaseContract } from 'ethers'
import { useEthersContext } from 'eth-hooks/context'

interface IUseSimpleContractReaderProps {
  contractReader: BaseContract
  functionCalled: (...args: any[]) => any | any[]
  functionArgs?: any[]
}

type TNullIfUndefined = {
  ifIsUndefined: any
  default: any
}

export const useSimpleContractReader = <T, U extends BaseContract>(
  contractReader: Record<string, BaseContract>,
  contractName: string,
  functionName: string,
  //   functionCalled: (...args: any[]) => any | any[],
  functionArgs: any[] = [],
  formatter?: (_value: any[]) => T,
  nullIfUndefined: TNullIfUndefined[] = []
): T | undefined => {
  const ethersContext = useEthersContext()
  const [value, setValue] = useState<T>()
  useEffect(() => {
    const callFunc = async (): Promise<void> => {
      for (let i = 0; i < nullIfUndefined.length; i++) {
        if (typeof nullIfUndefined[i].ifIsUndefined === 'undefined') {
          setValue(nullIfUndefined[i].default)
          return
        }
      }

      if (contractReader && contractReader?.[contractName]) {
        // console.log('CALLFUNC ')
        const readContracts = contractReader?.[contractName] as U
        // const args = functionArgs as const
        const res = await readContracts.functions?.[functionName]?.call(
          null,
          ...functionArgs
        )
        if (formatter) {
          setValue(formatter(res))
        } else {
          setValue(res)
        }
      }
    }
    void callFunc()
  }, [
    contractReader,
    nullIfUndefined,
    ethersContext.account,
    ethersContext.chainId,
    ethersContext.signer,
    ethersContext.library?.blockNumber,
    ethersContext.changeSigner,
    contractName,
    formatter,
    functionArgs,
    functionName,
  ])

  return value
}
