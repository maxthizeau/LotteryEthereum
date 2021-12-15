import { JsonRpcSigner } from '@ethersproject/providers'
import { THardhatContractJson } from 'eth-hooks/models'
import { BaseContract, Signer, Contract } from 'ethers'
import { useState, useEffect } from 'react'

import * as hardhatContracts from 'src/generated/contracts/hardhat_contracts.json'
import { useEthersContext } from 'eth-hooks/context'
import { useIsMounted } from 'usehooks-ts'
import {
  loadSpecificContractConfig,
  TAddressAndABI,
} from './loadSpecificContractConfig'

// BIG TODO : Specify network / include mainnet contracts

/*

Can & Should be factorized and optimized before use.
Set the type to useState

Use : 

  type Awaited<T> = T extends PromiseLike<infer U> ? U : T
  const blockNumber = useBlockNumberContext()
  const lotteryContract = useSpecificContract<LotteryContract>('Lottery')
  const fnReturnType = (false as true) && lotteryContract?.getTickets('')
  const [tickets, setTickets] = useState<Awaited<typeof fnReturnType>>()

  useEffect(() => {
    console.log('Start func')
    const callFunc = async () => {
      if (lotteryContract) {
        const res = await lotteryContract.getTickets(
          ethersContext.account ?? ''
        )
        console.log(res)
        setTickets(res)
      }
    }
    void callFunc()
  }, [blockNumber, lotteryContract])



*/

export const useSpecificContract = <T extends BaseContract>(
  contractName: string,
  signer?: Signer
): T | undefined => {
  const ethersContext = useEthersContext()
  const currentSigner = signer ?? ethersContext.signer
  // const initContract = new Contract('', '') as T
  const [contract, setContract] = useState<T>()
  const isMounted = useIsMounted()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/require-await
    const loadFunc = async (): Promise<void> => {
      console.log('Loading...')
      if (!ethersContext.chainId) {
        return
      }
      const contractInfoFromGeneratedFile: TAddressAndABI =
        await loadSpecificContractConfig(
          contractName,
          ethersContext.chainId,
          'localhost',
          currentSigner
        )
      // console.log(contractInfoFromGeneratedFile)
      const _contract = new Contract(
        contractInfoFromGeneratedFile.address,
        contractInfoFromGeneratedFile.abi,
        currentSigner
      ) as T
      setContract(_contract)
    }

    void loadFunc()
  }, [ethersContext.chainId, isMounted, setContract])
  return contract
}
