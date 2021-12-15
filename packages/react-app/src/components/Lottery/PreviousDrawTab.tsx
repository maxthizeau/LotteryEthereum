import { Button, Typography, List, Col, Row, Divider } from 'antd'
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { Draw, MyTicket, splitRatio, Ticket } from 'src/views/Lottery'
import Text from 'antd/lib/typography/Text'
import { useState, useEffect, FC, ReactElement, useCallback } from 'react'
import { formatEther } from '@ethersproject/units'
import { TicketStatus, TicketNumbers, Balance } from '../../views/Lottery'
import ClaimTab from 'src/components/Lottery/ClaimTab'
import { round } from 'src/helpers/utils'
import { BigNumber } from 'ethers'
import { useIsMounted } from 'usehooks-ts'
import { COIN_NAME } from 'src/config/constants'

const DrawNumber = styled.div`
  background-color: #667ba7;
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  margin: auto;
  align-items: center;
  display: flex;
  justify-content: center;
  color: #131a35;
  font-weight: bold;
  font-size: 1.2em;
`

interface IPreviousDrawTabProps {
  allDraws: Draw[] | undefined
  getOwnerTicketsForDraw: (
    drawId: number
  ) => Promise<{ tickets: Ticket[]; totalCount: BigNumber | null }>
  claimFunction: () => Promise<void>
  claimableAmount: string | undefined
}

const PreviousDrawTab: FC<IPreviousDrawTabProps> = ({
  allDraws,
  getOwnerTicketsForDraw,
  claimFunction,
  claimableAmount,
}: IPreviousDrawTabProps) => {
  const [drawShown, setDrawShown] = useState(
    allDraws ? allDraws?.length - 2 : 0
  )
  const [ticketsOfDrawShown, setTicketsOfDrawShown] = useState<Ticket[]>([])
  const [totalTicketsOfDrawShown, setTotalTicketsOfDrawShown] =
    useState<BigNumber>(BigNumber.from(0))

  const isMounted = useIsMounted()

  useEffect(() => {
    setDrawShown(allDraws ? allDraws?.length - 2 : 0)
  }, [isMounted, allDraws])

  const callbackFunc = useCallback(async () => {
    const res = await getOwnerTicketsForDraw(drawShown)
    setTicketsOfDrawShown(res.tickets)
    res.totalCount && setTotalTicketsOfDrawShown(res.totalCount)
  }, [drawShown, getOwnerTicketsForDraw])

  useEffect(() => {
    if (
      allDraws &&
      ((allDraws.length === 1 && allDraws[0] && allDraws[0].completed) ||
        allDraws.length > 1) &&
      drawShown <= allDraws?.length
    ) {
      callbackFunc()
    }
  }, [drawShown, allDraws, callbackFunc])

  if (!allDraws) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }

  // console.log()
  if (allDraws.length <= 1 || allDraws[drawShown] === undefined)
    return (
      <>
        <Typography.Title
          level={3}
          style={{
            flex: '1 0 0',
            justifyItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            margin: 0,
          }}
        >
          No draw have been made yet
        </Typography.Title>
      </>
    )
  return (
    <>
      <Row style={{ borderRadius: '8px', margin: '30px 0px' }}>
        <Col
          span={24}
          style={{
            background: '#0f1429',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              padding: '10px',
              alignItems: 'center',
              fontSize: '0.8em',
              marginBottom: '40px',
              background: '#05031b',
              borderRadius: '4px',
            }}
          >
            {drawShown >= 1 && (
              <Button
                icon={
                  <LeftCircleOutlined style={{ fontSize: '24px' }} disabled />
                }
                type="text"
                onClick={(): void => {
                  setDrawShown(drawShown - 1)
                }}
              />
            )}
            <Typography.Title
              level={5}
              style={{
                flex: '1 0 0',
                justifyItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                margin: 0,
              }}
            >
              Draw {allDraws[drawShown].id}
            </Typography.Title>
            {drawShown < allDraws.length - 2 && (
              <Button
                icon={<RightCircleOutlined style={{ fontSize: '24px' }} />}
                type="text"
                onClick={(): void => {
                  setDrawShown(drawShown + 1)
                }}
              />
            )}
          </div>
          <List
            style={{ margin: '20px 20px' }}
            grid={{ gutter: 16, column: 5 }}
            dataSource={allDraws[drawShown].numbers}
            renderItem={(item: number): ReactElement => (
              <List.Item>
                <DrawNumber>{item}</DrawNumber>
              </List.Item>
            )}
          />
          <Divider />
          <Balance style={{ marginBottom: 10 }}>
            💰{' '}
            {round(
              Number(formatEther(allDraws[drawShown].rewardBalanceAtDraw)),
              6
            )}{' '}
            {COIN_NAME}
            {/* 💰 {contractBalance ? formatEther(contractBalance) : '...'} {COIN_NAME} */}
          </Balance>
          <List
            itemLayout="horizontal"
            style={{ marginBottom: 20 }}
            dataSource={splitRatio}
            renderItem={(item): ReactElement => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <>
                      {item.goodNumbers} winning numbers balance :{' '}
                      {round(
                        Number(
                          formatEther(allDraws[drawShown].rewardBalanceAtDraw)
                        ) * item.percentOfBalance,
                        5
                      )}{' '}
                      {COIN_NAME} ({Math.round(item.percentOfBalance * 100)} %)
                    </>
                  }
                  description={
                    allDraws[drawShown].winnersByWinningNumber[
                      item.goodNumbers
                    ].toString() !== '0'
                      ? `${allDraws[drawShown].winnersByWinningNumber[
                          item.goodNumbers
                        ].toString()} winning tickets : ${
                          allDraws[drawShown].rewardBalanceAtDraw
                            ? round(
                                Number(
                                  formatEther(
                                    allDraws[drawShown].rewardsByWinningNumber[
                                      item.goodNumbers
                                    ]
                                  ) ?? 0
                                ),
                                6
                              )
                            : '...'
                        } ${COIN_NAME} each`
                      : 'No winner : Balance has been added to the next lottery'
                  }
                />
              </List.Item>
            )}
          />
          <Text>
            <i>
              Total tickets for this draw : {totalTicketsOfDrawShown.toString()}
            </i>
          </Text>
          <Text
            italic
            style={{
              fontSize: '0.8em',
              margin: '20px 20px',
              position: 'absolute',
              bottom: '0',
              right: '0',
            }}
          >
            Date : {allDraws[drawShown].startedAt}
          </Text>
        </Col>
      </Row>

      <Row>
        {/* Tickets for next draw */}
        <Col
          span={24}
          style={{
            background: '#0f1429',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <Typography.Title level={5} style={{ marginBottom: '20px' }}>
            Your tickets during draw #{drawShown ?? '0'} (
            {ticketsOfDrawShown.length} ticket
            {ticketsOfDrawShown.length > 1 && 's'})
          </Typography.Title>
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 4,
              lg: 4,
              xl: 6,
              xxl: 3,
            }}
            dataSource={ticketsOfDrawShown}
            renderItem={(item: Ticket): ReactElement => (
              <List.Item>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    // border: '1px solid',
                    borderRadius: '4px',
                    border:
                      item.status !== TicketStatus.Pending &&
                      item.status !== TicketStatus.Lost
                        ? '1px solid #4a9e77'
                        : 'inherit',
                  }}
                >
                  <MyTicket>
                    <span className="ticketId">Ticket #{item.id}</span>
                    <TicketNumbers style={{ marginBottom: '10px' }}>
                      {item.numbers.map((x, index) => (
                        <span key={index}>{x}</span>
                      ))}
                    </TicketNumbers>

                    <p
                      className={`informations ${
                        item.status !== TicketStatus.Lost &&
                        item.status !== TicketStatus.Pending
                          ? 'winning'
                          : ''
                      }`}
                    >
                      {item.status}
                    </p>
                    {item.status !== TicketStatus.Lost &&
                    item.status !== TicketStatus.Pending ? (
                      <p className="informations winning">
                        Earnings :{' '}
                        {round(Number(formatEther(item.rewardsAmount)), 2)}{' '}
                        {COIN_NAME}
                        {/* Claimable Amount : {item.rewardsAmount} ETH */}
                      </p>
                    ) : (
                      <p className="informations">Earnings : 0 {COIN_NAME}</p>
                    )}
                  </MyTicket>
                </div>
              </List.Item>
            )}
          />
        </Col>
      </Row>
      <Row>
        <Col
          span={24}
          style={{
            background:
              'linear-gradient(221.5deg,rgba(194,0,251,.1) 16.15%,rgba(194,0,251,0) 84.46%),radial-gradient(53.22% 53.22% at 93.67% 75.22%,rgba(194,0,251,.1) 0,rgba(90,196,190,.1) 55.21%,rgba(55,114,255,.1) 100%),#131a35',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '30px',
          }}
        >
          <Typography.Title level={5} style={{ marginBottom: '20px' }}>
            Total earnings
          </Typography.Title>
          <ClaimTab
            claimFunction={claimFunction}
            claimableAmount={claimableAmount}
          />
        </Col>
      </Row>
    </>
  )
}

export default PreviousDrawTab
