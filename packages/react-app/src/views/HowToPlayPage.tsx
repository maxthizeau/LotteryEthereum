import { Divider } from 'antd'
import React, { ReactElement } from 'react'
import LotteryBalances from 'src/components/Lottery/LotteryBalances'
import { IContractProps, ContractBalances } from './Lottery'
import { Lottery } from '../generated/contract-types'
import { useContractReaderWithFormatter } from '../hooks/useContractReaderWithFormatter'
import { formatBalances } from '../helpers/formatters'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { COIN_NAME } from 'src/config/constants'

const Question = styled.div`
  margin: 40px 0px;
  border: 1px solid #ccc;
  background: #020f31;
  border-radius: 4px;
  padding: 20px;
`

export const HowToPlayPage = (props: IContractProps): ReactElement => {
  // const ethComponentsSettings = useContext(EthComponentsSettingsContext)

  const lotteryReadContract = props.readContracts['Lottery'] as Lottery
  // const lotteryWriteContract = props.writeContracts['Lottery'] as Lottery
  // const tokenReadContract = props.readContracts['LottyToken'] as LottyToken

  const allBalances = useContractReaderWithFormatter<any[], ContractBalances>(
    lotteryReadContract,
    {
      contractName: 'Lottery',
      functionName: '_getAllBalances',
    },
    formatBalances,
    'App.tsx::allBalances'
  )

  return (
    <div
      style={{
        padding: 32,
        width: 600,
        margin: 'auto',
        marginTop: 32,
      }}
    >
      <h2>How to play ?</h2>

      <Question>
        <h3>1. Buy Lotty Token ({COIN_NAME})</h3>
        <Divider />
        <p>{COIN_NAME} is the currency used to buy tickets. </p>
        <p>Lottery Ticket price : 1 {COIN_NAME}</p>
        <p>
          <Link to="/swap">You can buy {COIN_NAME} at 0.005 ETH here.</Link>
        </p>
      </Question>
      <Question>
        <h3>2. Use your {COIN_NAME} to buy ticket(s)</h3>
        <Divider />
        <p>Now you have {COIN_NAME}, you can use them to buy a ticket. </p>
        <p>
          <Link to="/">Enter the next lottery and buy tickets here</Link>
        </p>
      </Question>
      <Question>
        <h3>3. Lottery draw</h3>
        <Divider />
        <p>
          Everybody can draw the lottery result. When the timer{' '}
          <Link to="/">here</Link> goes to zero, a button appears and you can
          draw the lottery result.{' '}
        </p>
        <p>
          Once draw have been made, you can see the result and claim your
          earnings.
        </p>
        <p>
          <Link to="/">
            See if you can draw the lottery result (look at the top-right timer)
          </Link>
        </p>
        <p>
          <Link to="/results">View the draw result </Link>
        </p>
      </Question>
      <Question>
        <h3>4. Claim earnings</h3>
        <Divider />
        <p>If you have a winning ticket, you can claim your earnings.</p>

        <p>
          <Link to="/results">Claim earnings (At the bottom of the page) </Link>
        </p>
      </Question>
      <Question>
        <h3>Is there fees ? </h3>
        <Divider />
        <p>
          Yes. 95% of the balance is distributed to winners and 5% are used for
          burn, staking, and developper fee.{' '}
        </p>
        <p>
          Here is the full split of lottery rewards :
          <ul>
            <li>10% : Split to every ticket that has 2 matching numbers</li>
            <li>15% : Split to every ticket that has 3 matching numbers</li>
            <li>25% : Split to every ticket that has 4 matching numbers</li>
            <li>45% : Split to every ticket that has 5 matching numbers</li>
            <li>1.5% : Developper fee</li>
            <li>1.5% : Burn</li>
            <li>2% : Added to staking rewards (coming soon...)</li>
          </ul>
        </p>

        <p>
          If there is not a single winning ticket with 2,3,4 or 5 matching
          numbers, the balance is added to the next lottery
        </p>
      </Question>

      <Question>
        <h3>Can I see the contract balance ?</h3>
        <LotteryBalances contractBalances={allBalances} />
      </Question>
    </div>
  )
}
