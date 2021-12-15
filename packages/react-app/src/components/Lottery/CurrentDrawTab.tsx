import { Button, Typography, List, InputNumber, Row, Col, Spin } from 'antd'

import styled from 'styled-components'
import { Balance, MyTicket, TicketNumbers } from 'src/views/Lottery'
import { round } from 'src/helpers/utils'
import { splitRatio, Ticket } from '../../views/Lottery'
import { formatEther } from '@ethersproject/units'
import { Link } from 'react-router-dom'
import { COIN_NAME } from '../../config/constants'
import { FC, ReactElement } from 'react'

const LottyInput = styled.div`
  background: inherit;
  border: 1px solid white;
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
    /* justify-content: space-between; */
    display: flex;
    flex-direction: column;
  }
  .coin-input-box .maximum {
    font-size: 0.8em;
    margin-top: 5px;
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
`

interface ICurrentDrawTabProps {
  contractBalance: string | undefined
  approve: () => void
  buyTickets: () => void
  tickets: Ticket[]
  onChange: (value: number) => void
  ltyUserBalance: string
  ltyAllowance: string
  amountToBuy: number
  loadingBuy: boolean
}

const CurrentDrawTab: FC<ICurrentDrawTabProps> = ({
  onChange,
  contractBalance,
  approve,
  buyTickets,
  tickets,
  ltyUserBalance,
  ltyAllowance,
  amountToBuy,
  loadingBuy,
}: ICurrentDrawTabProps) => {
  return (
    <>
      <Row style={{ borderRadius: '8px', margin: '30px 0px' }}>
        <Col
          span={16}
          style={{
            background: '#0f1429',
            padding: '20px',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            marginBottom: '10px',
          }}
          xs={{ span: 24 }}
          md={{ span: 16 }}
        >
          <Typography.Title level={4}>Balance / Split</Typography.Title>
          <Balance>
            💰{' '}
            {contractBalance
              ? round(Number(formatEther(contractBalance)), 6)
              : '...'}{' '}
            {COIN_NAME}
          </Balance>
          <List
            itemLayout="horizontal"
            dataSource={splitRatio}
            renderItem={(item): ReactElement => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <a href="https://ant.design">
                      {item.goodNumbers} winning numbers
                    </a>
                  }
                  description={`Winners split ${Math.round(
                    item.percentOfBalance * 100
                  )}% of balance (${
                    contractBalance
                      ? round(
                          item.percentOfBalance *
                            Number(formatEther(contractBalance) ?? 0),
                          6
                        )
                      : '...'
                  } ${COIN_NAME})`}
                />
              </List.Item>
            )}
          />
        </Col>
        {/* Buy tickets for next draw */}
        <Col
          span={8}
          style={{
            background:
              'linear-gradient(221.5deg,rgba(194,0,251,.1) 16.15%,rgba(194,0,251,0) 84.46%),radial-gradient(53.22% 53.22% at 93.67% 75.22%,rgba(194,0,251,.1) 0,rgba(90,196,190,.1) 55.21%,rgba(55,114,255,.1) 100%),#131a35',
            padding: '20px',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            marginBottom: '10px',
          }}
          xs={{ span: 24 }}
          md={{ span: 8 }}
        >
          <Typography.Title level={5} style={{ marginBottom: '20px' }}>
            Join Lottery : Buy tickets
          </Typography.Title>
          {/* <Row> */}

          <LottyInput>
            <label className="coin-label">
              <span>Ticket amount</span>
            </label>
            <div className="coin-input-box">
              <InputNumber
                min={1}
                max={100}
                value={amountToBuy}
                onChange={(e): void => {
                  onChange(e)
                }}
                style={{ width: '100%' }}
              />
              <span className="maximum">
                <a
                  onClick={(): void => {
                    console.log(Math.floor(Number(formatEther(ltyUserBalance))))
                    onChange(Math.floor(Number(formatEther(ltyUserBalance))))
                  }}
                >
                  Maximum : {Math.floor(Number(formatEther(ltyUserBalance)))}{' '}
                  {COIN_NAME}
                </a>
              </span>
            </div>
          </LottyInput>
          {Number(formatEther(ltyAllowance)) >= amountToBuy ? (
            <Button
              style={{
                width: '100%',
                marginTop: '20px',
                background: 'inherit',
              }}
              type="primary"
              onClick={buyTickets}
              disabled={Math.floor(Number(formatEther(ltyUserBalance))) < 1}
            >
              {loadingBuy ? <Spin /> : `Buy`}
            </Button>
          ) : (
            <Button
              style={{
                width: '100%',
                marginTop: '20px',
                background: 'inherit',
              }}
              type="primary"
              onClick={approve}
              disabled={Math.floor(Number(formatEther(ltyUserBalance))) < 1}
            >
              {loadingBuy ? <Spin /> : `Approve`}
            </Button>
          )}

          <div
            style={{ color: '#a5a0a0', fontSize: '0.9em', marginTop: '20px' }}
          >
            <p>There are two steps to buy ticket : </p>
            <p>
              1) Approve the amount (allow our smart contract to spend this
              amount of {COIN_NAME} to buy a ticket)
            </p>
            <p>2) Buy (convert your {COIN_NAME} to lottery tickets)</p>
          </div>

          {Math.floor(Number(formatEther(ltyUserBalance))) < 1 && (
            <div
              style={{ color: '#a5a0a0', fontSize: '0.9em', marginTop: '20px' }}
            >
              <p>You need at least 1 {COIN_NAME} to buy a ticket.</p>
              <Link to="/swap" style={{ color: '#9de5de' }}>
                You can buy {COIN_NAME} here.
              </Link>
            </div>
          )}

          {/* </Row> */}
        </Col>
      </Row>
      <Row>
        {/* Tickets for next draw */}
        <Col
          span={24}
          style={{
            background: '#0f1429',
            padding: '20px',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
          }}
        >
          <Typography.Title level={5} style={{ marginBottom: '20px' }}>
            Your tickets
          </Typography.Title>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
            dataSource={tickets}
            renderItem={(item: Ticket): ReactElement => {
              return (
                <List.Item>
                  <MyTicket>
                    <span className="ticketId">
                      Ticket #{item.id.toString()}
                    </span>
                    <TicketNumbers>
                      {item.numbers.map((x: number, index: number) => (
                        <span key={index}>{x}</span>
                      ))}
                    </TicketNumbers>
                  </MyTicket>
                </List.Item>
              )
            }}
          />
        </Col>
      </Row>
    </>
  )
}

export default CurrentDrawTab
