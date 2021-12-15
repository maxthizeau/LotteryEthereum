import { Button, Card } from 'antd'
import Countdown from 'antd/lib/statistic/Countdown'

import { IEthersContext } from 'eth-hooks/context'
import React, { ReactElement, useContext, useState, useEffect } from 'react'
import {
  Lottery as LotteryContract,
  LottyToken,
} from 'src/generated/contract-types'
import styled from 'styled-components'

import { transactor } from 'eth-components/functions'
import { EthComponentsSettingsContext } from 'eth-components/models'
import { parseEther } from '@ethersproject/units'
import CurrentDrawTab from 'src/components/Lottery/CurrentDrawTab'
import { useContractReaderWithFormatter } from 'src/hooks/useContractReaderWithFormatter'
import { BaseContract, BigNumberish } from 'ethers'

import {
  formatArrayToBoolean,
  formatToString,
  formatToTicketArray,
  formatToTimestamp,
} from 'src/helpers/formatters'

export interface Draw {
  id: number
  numbers: any[]
  completed: boolean
  rewardBalanceAtDraw: BigNumberish
  rewardsByWinningNumber: BigNumberish[]
  winnersByWinningNumber: BigNumberish[]
  startedAt: string
}

export enum TicketStatus {
  Pending = 'Pending...',
  Lost = 'Loosing ticket',
  TwoWinningNumber = '2 winning numbers',
  ThreeWinningNumber = '3 winning numbers',
  FourWinningNumber = '4 winning numbers',
  FiveWinningNumber = '5 winning numbers',
}

export interface Ticket {
  id: number
  numbers: number[]
  drawNumber: number
  claimed: boolean
  status: TicketStatus
  rewardsAmount: string
}

export interface ContractBalances {
  fullBalance: string
  claimableBalance: string
  devFeeBalance: string
  stakingBalance: string
  burnBalance: string
}

export const splitRatio = [
  {
    goodNumbers: 2,
    percentOfBalance: 0.1,
  },
  {
    goodNumbers: 3,
    percentOfBalance: 0.15,
  },
  {
    goodNumbers: 4,
    percentOfBalance: 0.25,
  },
  {
    goodNumbers: 5,
    percentOfBalance: 0.45,
  },
]

export const StyledCard = styled(Card)`
  margin: 30px auto !important;
  width: '100%';
`

export const MyTicket = styled.div`
  border-radius: 4px;
  padding: 10px;
  /* flex-wrap: wrap; */
  text-align: center;
  background: linear-gradient(
      221.5deg,
      rgba(194, 0, 251, 0.1) 16.15%,
      rgba(194, 0, 251, 0) 84.46%
    ),
    radial-gradient(
      53.22% 53.22% at 93.67% 75.22%,
      rgba(194, 0, 251, 0.1) 0,
      rgba(90, 196, 190, 0.1) 55.21%,
      rgba(55, 114, 255, 0.1) 100%
    ),
    #131a35;
  & span {
    margin-top: 5px;
  }
  & .informations {
    font-size: 0.8em;
    text-align: left;
    margin-bottom: 5px;
  }
  & .winning {
    color: #88c2a7;
  }
`
export const TicketNumbers = styled.div`
  display: flex;
  flex-grow: 1;
  & span {
    flex-grow: 1;
  }
`

export const Balance = styled.div`
  font-size: 2em;
  text-align: center;
`

// let deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30 // Moment is also OK

export interface IContractProps {
  ethersContext: IEthersContext
  readContracts: Record<string, BaseContract>
  writeContracts: Record<string, BaseContract>
  gasPrice: number | undefined
  ltyBalance: string
  userAddress: string
}

export const Lottery = ({
  ethersContext,
  readContracts,
  writeContracts,
  gasPrice,
  ltyBalance,
  userAddress,
}: IContractProps): ReactElement => {
  const ethComponentsSettings = useContext(EthComponentsSettingsContext)

  const tx = transactor(ethComponentsSettings, ethersContext?.signer, gasPrice)

  const lotteryWriteContract = writeContracts['Lottery'] as LotteryContract
  const lotteryReadContract = readContracts['Lottery'] as LotteryContract
  const tokenWriteContract = writeContracts['LottyToken'] as LottyToken
  const tokenReadContract = readContracts['LottyToken'] as LottyToken

  const [amountToBuy, setAmountToBuy] = useState(1)
  const [loadingBuy, setLoadingBuy] = useState(false)

  const buyTickets = async (): Promise<void> => {
    setLoadingBuy(true)
    await tx?.(lotteryWriteContract.buyMultipleRandomTicket(amountToBuy))
    // result && (await result?.wait())
    setLoadingBuy(false)
  }
  const approve = async (): Promise<void> => {
    setLoadingBuy(true)
    await tx?.(
      tokenWriteContract.approve(
        lotteryWriteContract.address,
        parseEther(amountToBuy.toString())
      )
    )

    setLoadingBuy(false)
  }

  const draw = async (): Promise<void> => {
    await tx?.(lotteryWriteContract.draw())
  }

  // const ownerTickets = useContractReaderWithFormatter<any[], Ticket[]>(
  //   lotteryReadContract,
  //   {
  //     contractName: 'Lottery',
  //     functionName: '_getCurrentDrawTicketsOfOwner',
  //     functionArgs: [userAddress],
  //   },
  //   formatToTicketArray,
  //   'Lottery.tsx::ownerTickets'
  // )

  const [ownerTickets, setOwnerTickets] = useState<Ticket[]>([])
  useEffect(() => {
    const callFunc = async (): Promise<void> => {
      if (lotteryReadContract) {
        console.log('CALLFUNC ')
        const res = await lotteryReadContract._getCurrentDrawTicketsOfOwner(
          ethersContext.account ?? ''
        )
        // console.log(res)
        setOwnerTickets(formatToTicketArray(res))
      }
    }
    console.log('ownerTickets ?')
    void callFunc()
  }, [
    lotteryReadContract,
    readContracts,
    ethersContext.account,
    ethersContext.chainId,
    ethersContext.library?.blockNumber,
  ])

  const nextLotteryTime = useContractReaderWithFormatter<string, number>(
    lotteryReadContract,
    {
      contractName: 'Lottery',
      functionName: 'nextLotteryAt',
    },
    formatToTimestamp,
    'Lottery.tsx::nextLotteryTime'
  )

  const contractBalance = useContractReaderWithFormatter<string, string>(
    lotteryReadContract,
    {
      contractName: 'Lottery',
      functionName: '_getBalance',
    },
    formatToString,
    'Lottery.tsx::contractBalance'
  )

  const needToDraw = useContractReaderWithFormatter<boolean[], boolean>(
    lotteryReadContract,
    {
      contractName: 'Lottery',
      functionName: 'needToDraw',
    },
    formatArrayToBoolean,
    'Lottery.tsx::needToDraw'
  )
  const [canDraw, setCanDraw] = useState(needToDraw ?? false)
  useEffect(() => {
    setCanDraw(needToDraw ?? false)
  }, [needToDraw])

  const [ltyAllowance, setLtyAllowance] = useState<string>('0')
  useEffect(() => {
    const callFunc = async (): Promise<void> => {
      if (tokenReadContract && lotteryReadContract) {
        const res = await tokenReadContract.allowance(
          ethersContext.account ?? '',
          lotteryReadContract.address
        )

        setLtyAllowance(res.toString())
      }
    }

    void callFunc()
  }, [
    readContracts,
    lotteryReadContract,
    tokenReadContract,
    ethersContext.account,
    ethersContext.chainId,
    ethersContext.library?.blockNumber,
  ])

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
      <h2>Lottery</h2>

      {!canDraw &&
      nextLotteryTime &&
      nextLotteryTime >= new Date().getTime() ? (
        <Countdown
          title="Next draw in..."
          value={nextLotteryTime}
          onFinish={(): void => setCanDraw(true)}
          style={{ position: 'absolute', top: 20, right: 30 }}
        />
      ) : (
        <p
          style={{
            position: 'absolute',
            top: 20,
            right: 30,
            color: 'rgba(255,255,255,.85)',
            fontSize: '24px',
          }}
        >
          Ready to draw...
        </p>
      )}

      {canDraw ||
      (nextLotteryTime && nextLotteryTime <= new Date().getTime()) ? (
        <Button
          style={{ width: '100%', margin: '30px auto' }}
          type="dashed"
          onClick={draw}
        >
          {`Don't want to wait admin ? Draw yourself, it's time !`}
        </Button>
      ) : (
        <p>{/* {canDraw} | {nextLotteryTime} */}</p>
      )}

      {/* <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Next draw" key="1"> */}
      <CurrentDrawTab
        contractBalance={contractBalance}
        ltyUserBalance={ltyBalance ?? '0'}
        ltyAllowance={ltyAllowance ?? '0'}
        buyTickets={buyTickets}
        approve={approve}
        amountToBuy={amountToBuy}
        tickets={ownerTickets ?? []}
        onChange={(value: number): void => {
          setAmountToBuy(value)
        }}
        loadingBuy={loadingBuy}
      />
      {/* </TabPane>
        <TabPane tab="Last draw" key="2"> */}
      {/* <PreviousDrawTab
        allDraws={draws}
        getOwnerTicketsForDraw={getOwnerTicketsForDraw}
      /> */}
      {/* </TabPane>
        <TabPane tab="Balances" key="3"> */}
      {/* <LotteryBalances contractBalances={allBalances} /> */}
      {/* </TabPane>
        <TabPane tab="Claim" key="4"> */}
      {/* <ClaimTab
        claimFunction={claimFunction}
        claimableAmount={claimableAmountOfAddress}
      /> */}
      {/* </TabPane>
      </Tabs> */}
    </div>
  )
}
