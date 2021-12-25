import { Divider, Button, Space, InputNumber, Row, Col, Input } from 'antd'
import React, { ReactElement, useContext, useState } from 'react'
import LotteryBalances from 'src/components/Lottery/LotteryBalances'
import { IContractProps, ContractBalances } from './Lottery'
import { Lottery } from '../generated/contract-types'
import { useContractReaderWithFormatter } from '../hooks/useContractReaderWithFormatter'
import { formatBalances } from '../helpers/formatters'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { COIN_NAME } from 'src/config/constants'
import { LottyToken } from '../generated/contract-types/LottyToken'
import { RandomNumberGenerator } from '../generated/contract-types/RandomNumberGenerator'
import { useEthersContext } from 'eth-hooks/context'
import { EthComponentsSettingsContext } from 'eth-components/models'
import { transactor } from 'eth-components/functions'
import { parseEther, formatEther } from '@ethersproject/units'
import { useSimpleContractReader } from 'src/hooks/useSimpleContractReader'
import Text from 'antd/lib/typography/Text'

const Block = styled.div`
  margin: 40px 0px;
  border: 1px solid #ccc;
  background: #020f31;
  border-radius: 4px;
  padding: 20px;
`

export const OwnerPage = (props: IContractProps): ReactElement => {
  const ethersContext = useEthersContext()
  const ethComponentsSettings = useContext(EthComponentsSettingsContext)

  const lotteryReadContract = props.readContracts['Lottery'] as Lottery
  const tokenReadContract = props.readContracts['LottyToken'] as LottyToken
  const rngReadContract = props.readContracts[
    'RandomNumberGenerator'
  ] as RandomNumberGenerator
  const lotteryWriteContract = props.writeContracts['Lottery'] as Lottery
  const tokenWriteContract = props.writeContracts['LottyToken'] as LottyToken
  const rngWriteContract = props.writeContracts[
    'RandomNumberGenerator'
  ] as RandomNumberGenerator

  const tx = transactor(
    ethComponentsSettings,
    ethersContext?.signer,
    props.gasPrice
  )

  const withdrawDevFee = async () => {
    await tx?.(lotteryWriteContract.withdraw())
  }
  const burn = async () => {
    await tx?.(lotteryWriteContract.burn())
  }

  const [fund, setFund] = useState(0)
  const fundNextLottery = async () => {
    if (lotteryWriteContract && fund > 0) {
      await tx?.(
        tokenWriteContract.transfer(
          lotteryWriteContract.address,
          parseEther(fund.toString())
        )
      )
    }
  }

  const [rngAddress, setRngAddress] = useState('')
  const changeRngAddress = async () => {
    await tx?.(lotteryWriteContract.setRandomNumberGenerator(rngAddress))
  }
  const [linkFee, setLinkFee] = useState(0)
  const changeLinkFee = async () => {
    await tx?.(rngWriteContract.setFee(parseEther(linkFee.toString())))
  }
  const [keyhash, setKeyhash] = useState('')
  const changeKeyhash = async () => {
    await tx?.(rngWriteContract.setKeyHash(keyhash))
  }

  const rngAddressInit = useSimpleContractReader<string, Lottery>(
    props.readContracts,
    'Lottery',
    'viewRandomNumberGenerator',
    [],
    (_value) => _value.toString()
  )
  const linkFeeInit = useSimpleContractReader<number, RandomNumberGenerator>(
    props.readContracts,
    'RandomNumberGenerator',
    'viewFee',
    [],
    (_value) => Number(formatEther(_value.toString()))
  )
  const keyhashInit = useSimpleContractReader<string, RandomNumberGenerator>(
    props.readContracts,
    'RandomNumberGenerator',
    'viewKeyHash',
    [],
    (_value) => _value.toString()
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
      <h2>Lottery</h2>
      <Block>
        <h3>Informations</h3>
        <Divider />
        <p>
          Lottery contract address :{' '}
          {lotteryReadContract?.address ?? 'loading...'}
        </p>
        <p>
          Token contract address : {tokenReadContract?.address ?? 'loading...'}
        </p>
        <p>RNG contract address : {rngReadContract?.address ?? 'loading...'}</p>
      </Block>

      <Block>
        <h3>Fees</h3>
        <Divider />
        <Button
          style={{ width: '100%', marginBottom: 20 }}
          onClick={withdrawDevFee}
        >
          Withdraw dev fee balance
        </Button>
        <Button style={{ width: '100%' }} onClick={burn}>
          Burn burn balance
        </Button>
      </Block>
      <Block>
        <h3>Fund next lottery</h3>
        <Divider />
        <Row style={{ width: '100%' }} gutter={20}>
          <Col span={18}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder="1000"
              value={fund}
              onChange={(e) => {
                setFund(e)
              }}
            />
          </Col>
          <Col span={6}>
            <Button style={{ width: '100%' }} onClick={fundNextLottery}>
              Fund
            </Button>
          </Col>
        </Row>
      </Block>

      <Block>
        <h3>Set RNG address</h3>
        <Divider />
        <Text style={{ fontSize: '0.8em' }}>Current : {rngAddressInit}</Text>
        <Row style={{ width: '100%', marginTop: 20 }} gutter={20}>
          <Col span={18}>
            <Input
              style={{ width: '100%' }}
              placeholder="0x000000000000"
              value={rngAddress}
              onChange={(e) => setRngAddress(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Button style={{ width: '100%' }} onClick={changeRngAddress}>
              Set
            </Button>
          </Col>
        </Row>
      </Block>
      <h2>Random Number Generator</h2>
      <Block>
        <h3>Set fee</h3>
        <Divider />
        <Text style={{ fontSize: '0.8em' }}>Current : {linkFeeInit} LINK</Text>
        <Row style={{ width: '100%', marginTop: 20 }} gutter={20}>
          <Col span={18}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.1 (Link **18)"
              value={linkFee}
              onChange={(e) => setLinkFee(e)}
            />
          </Col>
          <Col span={6}>
            <Button style={{ width: '100%' }} onClick={changeLinkFee}>
              Set
            </Button>
          </Col>
        </Row>
      </Block>
      <Block>
        <h3>Set Keyhash </h3>
        <Divider />
        <Text style={{ fontSize: '0.8em' }}>Current : {keyhashInit}</Text>
        <Row style={{ width: '100%', marginTop: 20 }} gutter={20}>
          <Col span={18}>
            <Input
              style={{ width: '100%' }}
              placeholder="0x000000000000"
              value={keyhash}
              onChange={(e) => setKeyhash(e.target.value)}
            />
          </Col>
          <Col span={6}>
            <Button style={{ width: '100%' }} onClick={changeKeyhash}>
              Set
            </Button>
          </Col>
        </Row>
      </Block>
    </div>
  )
}
