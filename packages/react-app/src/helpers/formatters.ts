/* eslint-disable */

import { ContractBalances, Draw, Ticket, TicketStatus } from '../views/Lottery'
// import { formatEther } from '@ethersproject/units'

export const formatBalances = (
  _value: any[] | undefined
): ContractBalances | undefined => {
  if (!_value) return undefined
  const balances: ContractBalances = {
    fullBalance: _value[0].toString(),
    claimableBalance: _value[1].toString(),
    devFeeBalance: _value[2].toString(),
    stakingBalance: _value[3].toString(),
    burnBalance: _value[4].toString(),
  }
  return balances
}

export const formatDraws = (_res: any[] | undefined): Draw[] | undefined => {
  // uint256 id;
  //   uint8[5] numbers;
  //   bool completed;
  //   uint256 rewardBalanceAtDraw;
  //   uint256[6] rewardsByWinningNumber; // [0, 0, 0.2, 0.4, 0.8, 1.5] : 4 winning numbers ticket can claim 0.8, 5 winning numbers ticket can claim 1.5, ...
  //   uint32[6] winnersByWinningNumber; // [90, 47, 41, 7, 1, 0] : 1 ticket has 4 winning numbers, 0 ticket has 5 winning numbers
  //   uint256 startedAt;

  if (_res && _res[0]) {
    const tmpDraws: Draw[] = []
    for (let i = 0; i < _res[0].length; i++) {
      const draw = _res[0][i]
      const id = Number(draw[0])
      tmpDraws.push({
        id,
        numbers: draw[1],
        completed: draw[2],
        rewardBalanceAtDraw: draw[3],
        rewardsByWinningNumber: draw[4],
        winnersByWinningNumber: draw[5],
        startedAt: new Date(Number(draw[6]) * 1000).toUTCString(),
      })
    }
    console.log(tmpDraws)
    return tmpDraws
  }
  return []
}

export const formatToString = (_value: string | undefined): string =>
  _value?.toString() ?? ''

export const formatArrayToBoolean = (
  _value: boolean[] | undefined
): boolean | undefined => _value?.[0]

export const formatToTimestamp = (
  _value: string | undefined
): number | undefined => {
  if (!_value) return undefined
  return new Date(Number(_value) * 1000).getTime()
}

export const formatToTicketArray = (_value: any[] | undefined): Ticket[] => {
  if (!_value) return []

  const tickets: Ticket[] = []

  if (_value) {
    for (let i = 0; i < _value.length; i++) {
      const ticket = _value[i]

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
        id: ticket[5].toString(),
        numbers: ticket[0],
        drawNumber: ticket[1].toNumber(),
        claimed: ticket[2],
        status,
        rewardsAmount: ticket[4].toString(),
      })
    }
  }

  return tickets
}
