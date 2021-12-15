import { useBlockNumberContext, useEthersContext } from 'eth-hooks/context'
import { TContractFunctionInfo } from 'eth-hooks/models'
import { BaseContract, ContractFunction } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { useIsMounted } from 'usehooks-ts'

/**
 * #### Summary
 * Enables you to call a contract function with arguments and receive the output.  You can use this to easily track of contract outputs in react states
 *
 * #### Notes
 * - uses the ethers.Contract object's provider to access the network
 * - formatter is a function that can change the format of the output
 *
 * @category Hooks
 *
 * @template OutputT return type
 * @param contract ethers.Contract class
 * @param contractFunctionInfo
 * @param formatter <OutputT> a function that can format the output
 * @param onChange callback with result as a parameter
 * @returns <OutputT>
 */
export const useContractReaderWithFormatter = <OutputT, OutputFormat>(
  contract: BaseContract,
  contractFunctionInfo: TContractFunctionInfo,
  formatter: (_value: OutputT | undefined) => OutputFormat | undefined,
  debug: string = 'debug'
  // onChange?: (_value?: OutputT) => void
): OutputFormat | undefined => {
  const isMounted = useIsMounted()
  const [value, setValue] = useState<OutputFormat>()

  const blockNumber = useBlockNumberContext()
  const ethersContext = useEthersContext()

  const callContractFunction = useCallback(async () => {
    console.log(contractFunctionInfo.functionArgs)

    const contractFunction = contract.functions?.[
      contractFunctionInfo.functionName
    ] as ContractFunction<OutputT>
    let result: OutputT | undefined = undefined
    try {
      if (
        contractFunctionInfo.functionArgs &&
        contractFunctionInfo.functionArgs.length > 0
      ) {
        result = await contractFunction?.(...contractFunctionInfo.functionArgs)
      } else {
        result = await contractFunction?.()
      }
    } catch (error: any) {
      console.warn(
        'Could not read from contract function',
        contractFunctionInfo
      )
    }
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contract,
    contractFunctionInfo.functionArgs,
    contractFunctionInfo.functionName,
  ])

  const contractProvider = contract?.provider

  const callFunc = useCallback(async () => {
    const contractChainId = (await contractProvider?.getNetwork())?.chainId
    if (
      callContractFunction != null &&
      contractChainId === ethersContext.chainId &&
      contractProvider != null &&
      ethersContext?.chainId
    ) {
      try {
        const newResult: OutputT | undefined = await callContractFunction()
        let formattedResult: OutputFormat | undefined = undefined
        if (formatter != null && newResult) {
          formattedResult = formatter(newResult)
        }

        if (isMounted()) {
          setValue((value) => {
            if (
              !Object.is(value, newResult) &&
              JSON.stringify(value) !== JSON.stringify(newResult)
            ) {
              return formattedResult
            }
            return value
          })
          // onChange?.(newResult);
        }
      } catch (error: any) {
        console.warn(error)
      }
    }
  }, [
    contractProvider,
    // contract,
    callContractFunction,
    ethersContext?.chainId,
    formatter,
    isMounted,
  ])

  useEffect(() => {
    // console.log(debug)
    void callFunc()
  }, [blockNumber, callFunc])

  return value
}
