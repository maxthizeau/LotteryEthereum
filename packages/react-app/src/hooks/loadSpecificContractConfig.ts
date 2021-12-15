import { JsonRpcSigner } from '@ethersproject/providers'
import { THardhatContractJson } from 'eth-hooks/models'
import { BaseContract, Signer, Contract, ContractInterface } from 'ethers'
import { useState, useEffect } from 'react'

import * as hardhatContracts from 'src/generated/contracts/hardhat_contracts.json'
import { useEthersContext, IEthersContext } from 'eth-hooks/context'
import { useIsMounted } from 'usehooks-ts'

// const signer = provider.getSigner()
//     const contractInfos = hardhatContracts[31337].localhost.contracts.Lottery
//     const contract = new ethers.Contract(
//       contractInfos.address,
//       contractInfos.abi,
//       signer
//     ) as LotteryContract

// BIG TODO : Specify network / include mainnet contracts
interface IUseSpecificContractProps {
  signer: Signer
  contractName: string
}

export type TDeployedContractsJson = {
  [chainId: number]: {
    [networkName: string]: {
      name: string
      chainId: string
      contracts: {
        [contractName: string]: THardhatContractJson
      }
    }
  }
}

export type TAddressAndABI = {
  address: string
  abi: ContractInterface
}

export const loadSpecificContractConfig = async <T extends BaseContract>(
  contractName: string,
  chainId: number,
  networkName: string,
  signer?: Signer
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<any> => {
  const contractListJsonPromise = import(
    '../generated/contracts/hardhat_contracts.json'
  )

  const allContracts = ((await contractListJsonPromise).default ??
    {}) as unknown as TDeployedContractsJson

  const addressAndABI: TAddressAndABI =
    allContracts[chainId][networkName].contracts[contractName]
  // const allContracts = hardhatContracts as TDeployedContractsJson

  return addressAndABI
}
