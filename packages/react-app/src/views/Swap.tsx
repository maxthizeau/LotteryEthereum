import { Button, Card, Input, Spin } from 'antd'
import { useContractLoader } from 'eth-hooks'
import { useEthersContext } from 'eth-hooks/context'
import React, { ReactElement, useContext, useState } from 'react'
import { Lottery as LotteryContract } from 'src/generated/contract-types'
import styled from 'styled-components'
import { useAppContracts } from '../hooks/useAppContracts'
import { transactor } from 'eth-components/functions'
import { EthComponentsSettingsContext } from 'eth-components/models'
import { SwapOutlined } from '@ant-design/icons'
import { formatEther, parseEther } from '@ethersproject/units'
import { useContractReaderWithFormatter } from '../hooks/useContractReaderWithFormatter'
import { LottyToken } from '../../../hardhat/helpers/types/contract-types/LottyToken'
import { formatToString } from 'src/helpers/formatters'
import { BigNumberish } from 'ethers'
import { COIN_NAME } from 'src/config/constants'

const SwapBox = styled(Card)`
  padding: 1px;
  background: linear-gradient(
    245.22deg,
    #da2eef 7.97%,
    #2b6aff 49.17%,
    #39d0d8 92.1%
  );
  border-radius: 4px;

  & .ant-card-body {
    display: grid;
    grid-auto-rows: auto;
    grid-row-gap: 12px;
    row-gap: 12px;
    padding: 32px 24px;
    background-color: #131a35;
    opacity: 0.9;
    border-radius: 4px;
  }
`

const SwapBody = styled.div`
  display: flex;
  justify-items: center;
  flex-direction: column;
`
const SwapField = styled.div`
  background: #000829;
  border-radius: 4px;
  padding: 10px 0px;

  .coin-label {
    padding: 0.75rem 1rem 0;
    font-size: 12px;
    line-height: 14px;
    color: #85858d;
    display: flex;
    justify-content: space-between;
  }
  .coin-input-box {
    padding: 0.75rem 0.75rem 0.75rem 1rem;
    justify-content: space-between;
    display: flex;
  }
  .coin-input {
    padding: 0;
    border: none;
    background-color: transparent;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    flex: 1 1 auto;
    color: #f1f1f2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 10px 16px;
  }
  .coin-icon {
    display: flex;
    padding: 10px;
    align-items: center;
    /* align-items: center; */
    & span {
      font-weight: bold;
    }
    & img {
      width: 20px;
      margin-right: 10px;
    }
  }
`
const SwapIcon = styled(Button)`
  width: 50px;
  height: 50px;
  align-self: center;
  justify-content: center;
  align-content: center;
  display: flex;
  align-items: center;
  border-radius: 9999;
  margin: 15px 0px;
`
const SwapButton = styled.div``

export const Swap = ({
  yourCurrentBalance,
}: {
  yourCurrentBalance: BigNumberish
}): ReactElement => {
  const ethersContext = useEthersContext()
  const appContract = useAppContracts()

  const readContracts = useContractLoader(appContract)
  const writeContracts = useContractLoader(appContract, ethersContext.signer)
  const ethComponentsSettings = useContext(EthComponentsSettingsContext)
  // const gasPrice = 1000000000
  // const gasPrice = useGasPrice(ethersContext.chainId, 'fast')
  const tx = transactor(ethComponentsSettings, ethersContext?.signer)

  const lotteryWriteContract = writeContracts['Lottery'] as LotteryContract
  // const lotteryReadContract = readContracts['Lottery'] as LotteryContract
  const tokenReadContract = readContracts['LottyToken'] as LottyToken

  const ticketPrice = 0.005

  const [coinInput, setCoinInput] = useState<string>('')
  const [coinOutput, setCoinOutput] = useState<string>('')
  const [loadingSwap, setLoadingSwap] = useState<boolean>(false)

  const changeCoinInput = (_value: string): void => {
    setCoinInput(_value)
    const value =
      _value.endsWith('.') || _value.endsWith(',')
        ? Number(_value + '0') / ticketPrice
        : Number(_value) / ticketPrice
    setCoinOutput(value?.toString() ?? '')
  }
  const onChangeCoinInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const regexNumber = /^[0-9]*([,.][0-9]*)?$/

    if (regexNumber.exec(e.target.value)) {
      changeCoinInput(e.target.value.replace(',', '.'))
    }
  }

  const swap = async (): Promise<void> => {
    console.log('swap begin')
    setLoadingSwap(true)
    await tx?.(
      lotteryWriteContract.buyLottyToken({ value: parseEther(coinInput) })
    )
    changeCoinInput('')
    setLoadingSwap(false)
  }

  const ltyBalance = useContractReaderWithFormatter<string, string>(
    tokenReadContract,
    {
      contractName: 'LottyToken',
      functionName: 'balanceOf',
      functionArgs: [ethersContext.account],
    },
    formatToString
  )

  return (
    <div
      style={{
        padding: 32,
        width: 600,
        margin: 'auto',
        marginTop: 32,
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* <Typography.Title level={4} style={{ marginBottom: '30px' }}>
        Buy {COIN_NAME}
      </Typography.Title> */}
      <h2 style={{ marginBottom: 20 }}>Buy {COIN_NAME}</h2>
      <SwapBox>
        <SwapBody>
          <SwapField>
            <label className="coin-label">
              <span>From :</span>
              <span>
                <a
                  onClick={(): void => {
                    changeCoinInput(
                      yourCurrentBalance ? formatEther(yourCurrentBalance) : '0'
                    )
                  }}
                >
                  Balance :{' '}
                  {yourCurrentBalance
                    ? formatEther(yourCurrentBalance)
                    : 'loading...'}{' '}
                  ETH
                </a>
              </span>
            </label>
            <div className="coin-input-box">
              <Input
                className="coin-input"
                placeholder="3.00"
                onChange={onChangeCoinInput}
                value={coinInput}
              />
              <div className="coin-icon">
                <img src="https://assets.coingecko.com/coins/images/279/thumb_2x/ethereum.png?1595348880" />
                <span>ETH</span>
              </div>
            </div>
          </SwapField>
          <SwapIcon type="text">
            <SwapOutlined rotate={90} />
          </SwapIcon>
          <SwapField>
            <label className="coin-label">
              <span>To :</span>
              <span>
                <a>
                  Balance : {ltyBalance ? formatEther(ltyBalance) : '0.0'}{' '}
                  {COIN_NAME}
                </a>
              </span>
            </label>
            <div className="coin-input-box">
              <Input className="coin-input" value={coinOutput} />
              <div className="coin-icon">
                <img src="/lty-sig.png" />
                <span>{COIN_NAME}</span>
              </div>
            </div>
          </SwapField>
          <Button style={{ marginTop: '20px' }} onClick={swap}>
            {loadingSwap ? <Spin /> : `Swap`}
          </Button>
        </SwapBody>
      </SwapBox>
    </div>
  )
}
