import { formatEther } from '@ethersproject/units'
import { Collapse, Spin, Typography } from 'antd'
import { FC } from 'react'
import { COIN_NAME } from 'src/config/constants'
import { ContractBalances } from 'src/views/Lottery'

interface ILotteryBalancesProps {
  contractBalances: ContractBalances | undefined
}

const LotteryBalances: FC<ILotteryBalancesProps> = ({
  contractBalances,
}: ILotteryBalancesProps) => {
  if (!contractBalances) {
    return <Spin />
  }
  return (
    <Collapse accordion>
      <Collapse.Panel
        header={`Contract Balance : ${formatEther(
          contractBalances.fullBalance
        )} ${COIN_NAME}`}
        key="1"
      >
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          {formatEther(contractBalances.fullBalance)} {COIN_NAME}{' '}
        </Typography.Title>
        <p>
          This is the full contract Balance (All balances below + Rewards of the
          next draw.)
          <br />
        </p>
      </Collapse.Panel>
      <Collapse.Panel
        header={`Claimable Balance : ${formatEther(
          contractBalances.claimableBalance
        )} ${COIN_NAME}`}
        key="2"
      >
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          {formatEther(contractBalances.claimableBalance)} {COIN_NAME}{' '}
        </Typography.Title>
        <p>
          This is the amount of {COIN_NAME} that can be claimed by winners.
          <br />
          Only winners can access this balance.
        </p>
      </Collapse.Panel>
      <Collapse.Panel
        header={`Dev Fee Balance : ${formatEther(
          contractBalances.devFeeBalance
        )} ${COIN_NAME}`}
        key="3"
      >
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          {formatEther(contractBalances.devFeeBalance)} {COIN_NAME}{' '}
        </Typography.Title>
        <p>
          This is the amount of {COIN_NAME} that can be claimed by contract
          owner.
          <br />
          Only developpers can access this balance.
        </p>
      </Collapse.Panel>
      <Collapse.Panel
        header={`Staking Balance : ${formatEther(
          contractBalances.stakingBalance
        )} ${COIN_NAME}`}
        key="4"
      >
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          {formatEther(contractBalances.stakingBalance)} {COIN_NAME}{' '}
        </Typography.Title>
        <p>
          This is the amount of {COIN_NAME} that will be added to staking
          reward.
          <br />
          No one can access this balance. Even the owner of the contract.
        </p>
      </Collapse.Panel>
      <Collapse.Panel
        header={`Burn Balance : ${formatEther(
          contractBalances.burnBalance
        )} ${COIN_NAME}`}
        key="5"
      >
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          {formatEther(contractBalances.burnBalance)} {COIN_NAME}{' '}
        </Typography.Title>
        <p>
          This is the amount of {COIN_NAME} that will be burn soon.
          <br />
          No one can access this balance. Even the owner of the contract.
        </p>
      </Collapse.Panel>
    </Collapse>
  )
}

export default LotteryBalances
