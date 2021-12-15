import { useEthersContext } from 'eth-hooks/context'
import React, { ReactElement, useContext } from 'react'
import {
  Lottery as LotteryContract,
  LottyToken,
} from 'src/generated/contract-types'

import { useAppContracts } from '../hooks/useAppContracts'
import { transactor } from 'eth-components/functions'
import { EthComponentsSettingsContext } from 'eth-components/models'
import PreviousDrawTab from 'src/components/Lottery/PreviousDrawTab'
import { useContractReaderWithFormatter } from 'src/hooks/useContractReaderWithFormatter'
import { BaseContract, BigNumber } from 'ethers'
import { Draw, TicketStatus, Ticket } from './Lottery'
import { formatDraws, formatToString } from 'src/helpers/formatters'

interface ILotteryPageProps {
  readContracts: Record<string, BaseContract>
  writeContracts: Record<string, BaseContract>
  gasPrice: number | undefined
  ltyBalance: string
}

export const LotteryResult = ({
  readContracts,
  writeContracts,
  gasPrice,
  ltyBalance,
}: ILotteryPageProps): ReactElement => {
  const ethersContext = useEthersContext()
  const appContract = useAppContracts()

  const ethComponentsSettings = useContext(EthComponentsSettingsContext)

  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice)

  const lotteryWriteContract = writeContracts['Lottery'] as LotteryContract
  const lotteryReadContract = readContracts['Lottery'] as LotteryContract
  const tokenWriteContract = writeContracts['LottyToken'] as LottyToken
  const tokenReadContract = readContracts['LottyToken'] as LottyToken

  const draws = useContractReaderWithFormatter<any[], Draw[]>(
    lotteryReadContract,
    {
      contractName: 'Lottery',
      functionName: '_getAllDraws',
    },
    formatDraws
  )

  const claimFunction = async (): Promise<void> => {
    const result = await tx?.(lotteryWriteContract.claim())
  }

  // Function called when user is looking the previous draws. It request and format tickets of the draw
  const getOwnerTicketsForDraw = async (
    drawId: number
  ): Promise<{ tickets: Ticket[]; totalCount: BigNumber | null }> => {
    const result = await lotteryReadContract._getTicketsOfOwnerForDraw(
      ethersContext.account ?? '',
      drawId
    )
    const totalTicketCountForDraw = await lotteryReadContract.drawToTicketCount(
      drawId
    )

    if (!result) return { tickets: [], totalCount: null }

    const tickets: Ticket[] = []

    if (result[0]) {
      for (let i = 0; i < result.length; i++) {
        const ticket = result[i]
        let status: TicketStatus
        switch (ticket[3]) {
          case 0:
            status = TicketStatus.Pending
            break
          case 1:
            status = TicketStatus.Lost
            break
          case 2:
            status = TicketStatus.TwoWinningNumber
            break
          case 3:
            status = TicketStatus.ThreeWinningNumber
            break
          case 4:
            status = TicketStatus.FourWinningNumber
            break

          default:
            status = TicketStatus.FiveWinningNumber
            break
        }

        tickets.push({
          id: i,
          numbers: ticket[0],
          drawNumber: ticket[1].toNumber(),
          claimed: ticket[2],
          status,
          rewardsAmount: ticket[4].toString(),
        })
      }
    }

    return { tickets, totalCount: totalTicketCountForDraw }
  }

  const claimableAmountOfAddress = useContractReaderWithFormatter<
    string,
    string
  >(
    lotteryReadContract,
    {
      contractName: 'Lottery',
      functionName: 'getClaimableAmountOfAddress',
      functionArgs: [ethersContext.account ?? ''],
    },
    formatToString
  )

  return (
    <div
      style={{
        padding: 32,
        width: '80%',
        margin: 'auto',
        marginTop: 32,
        position: 'relative',
      }}
    >
      <h2>Finished rounds </h2>

      <PreviousDrawTab
        allDraws={draws}
        getOwnerTicketsForDraw={getOwnerTicketsForDraw}
        claimFunction={claimFunction}
        claimableAmount={claimableAmountOfAddress}
      />
    </div>
  )
}
