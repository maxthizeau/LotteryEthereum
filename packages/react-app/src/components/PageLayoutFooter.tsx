/* eslint-disable @typescript-eslint/explicit-module-boundary-types  */
/* eslint-disable @typescript-eslint/explicit-function-return-type  */

import { Row, Col } from 'antd'
import { Faucet } from 'src/components/common/'
import { IScaffoldAppProviders } from 'src/hooks/useScaffoldAppProviders'
import { useEthersContext } from 'eth-hooks/context'
import styled from 'styled-components'

import {
  FaucetHintButton,
  getFaucetAvailable,
} from 'src/components/common/FaucetHintButton'
import {
  GithubOutlined,
  LinkedinOutlined,
  TwitterOutlined,
} from '@ant-design/icons'

export interface IPageLayoutFooterProps {
  scaffoldAppProviders: IScaffoldAppProviders
  price: number
  gasPrice: number
}

const PageLayoutFooter = (props: IPageLayoutFooterProps) => {
  const ethersContext = useEthersContext()

  // Faucet Tx can be used to send funds from the faucet
  const faucetAvailable = getFaucetAvailable(
    props.scaffoldAppProviders,
    ethersContext
  )

  const FooterStyles = styled.div`
    color: #8b8b8b;
    & a {
      color: rgb(197, 197, 197);
    }
  `

  return (
    <>
      <FooterStyles>
        <div
          style={{
            width: '100%',
            height: '1px',
            margin: '30px',
            background:
              'rgba(0, 0, 0, 0) linear-gradient(90deg, rgba(90, 196, 190, 0) 0%, rgb(55, 114, 255) 50%, rgba(194, 0, 251, 0) 100%) repeat scroll 0% 0%',
          }}
        />
        <Row gutter={16}>
          <Col span={4}></Col>
          <Col span={16}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '',
              }}
            >
              <span>
                Made by{' '}
                <a href="https://github.com/maxthizeau">Maxime Thizeau</a>
              </span>

              <span>
                Created from{' '}
                <a href="https://github.com/scaffold-eth">scaffold-eth</a>
              </span>
              <span>
                Design inspired by <a href="https://raydium.io/">Raydium</a>
              </span>
            </div>
          </Col>
          <Col span={4}>
            <div style={{ display: 'flex', justifyContent: 'end', gap: 12 }}>
              <a href="https://github.com/maxthizeau">
                <GithubOutlined />
              </a>
              <a href="https://twitter.com/MaximeThizeau">
                <TwitterOutlined />
              </a>

              <a href="https://www.linkedin.com/in/maxime-thizeau-845840170/">
                <LinkedinOutlined />
              </a>
            </div>
          </Col>
        </Row>

        <div
          style={{
            width: '100%',
            height: '1px',
            margin: '30px',
            background:
              'rgba(0, 0, 0, 0) linear-gradient(90deg, rgba(90, 196, 190, 0) 0%, rgb(55, 114, 255) 50%, rgba(194, 0, 251, 0) 100%) repeat scroll 0% 0%',
          }}
        />
        <Row align="middle" gutter={[4, 4]}>
          <Col span={12}>
            {
              /*  if the local provider has a signer, let's show the faucet:  */
              faucetAvailable &&
              props.scaffoldAppProviders?.mainnetProvider &&
              props.scaffoldAppProviders?.localProvider ? (
                <Faucet
                  localProvider={props.scaffoldAppProviders.localProvider}
                  price={props.price}
                  mainnetProvider={props.scaffoldAppProviders.mainnetProvider}
                />
              ) : (
                <></>
              )
            }
          </Col>
          <Col span={12}>
            <FaucetHintButton
              scaffoldAppProviders={props.scaffoldAppProviders}
              gasPrice={props.gasPrice}
            />
          </Col>
        </Row>
        {/* </div> */}
      </FooterStyles>
    </>
  )
}

export default PageLayoutFooter
