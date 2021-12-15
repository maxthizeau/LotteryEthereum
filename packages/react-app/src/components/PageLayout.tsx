import React, { ReactElement, ReactNode } from 'react'
import { Menu, Layout } from 'antd'
import { useLocation, Link } from 'react-router-dom'
import { Account } from './common/Account'
import { IScaffoldAppProviders } from '../hooks/useScaffoldAppProviders'
import PageLayoutFooter from './PageLayoutFooter'
import { formatEther } from '@ethersproject/units'
import { round } from '../helpers/utils'

const { Header, Content, Footer } = Layout

interface IPageLayoutProps {
  children: ReactNode
  scaffoldAppProviders: IScaffoldAppProviders
  price: number
  gasPrice: number
  ltyBalance: string
}

export const PageLayout = ({
  children,
  scaffoldAppProviders,
  price,
  gasPrice,
  ltyBalance,
}: IPageLayoutProps): ReactElement => {
  const location = useLocation()

  // const accountProps : IAccountProps = {
  //   ensProvider
  // }

  return (
    <>
      <Layout>
        <Header
          style={{
            display: 'flex',
            flexDirection: 'row',
            textAlign: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'inherit',
            borderBottom: '1px solid #424242',
          }}
        >
          <div style={{ marginLeft: '25px' }}>
            <Link to="/">
              <img src="lotty-logo.png" style={{ height: '25px' }} />
            </Link>
          </div>
          <Menu
            style={{
              flexGrow: '1',
              textAlign: 'center',
              justifyContent: 'center',
              background: 'inherit',
              border: 'none',
            }}
            selectedKeys={[location.pathname]}
            mode="horizontal"
          >
            <Menu.Item key="/">
              <Link to="/">Lottery</Link>
            </Menu.Item>
            <Menu.Item key="/results">
              <Link to="/results">Results</Link>
            </Menu.Item>
            <Menu.Item key="/swap">
              <Link to="/swap">Swap</Link>
            </Menu.Item>
            <Menu.Item key="/how-to-play">
              <Link to="/how-to-play">How to play ?</Link>
            </Menu.Item>
          </Menu>
          <div style={{ marginRight: '25px', lineHeight: '1.2em' }}>
            {round(Number(formatEther(ltyBalance)), 4)}
            <img
              style={{
                width: '20px',
                height: '20px',
                marginBottom: '3px',
                marginLeft: '5px',
              }}
              src="/lty-sig.png"
            />
          </div>
          <div style={{ marginRight: '25px', lineHeight: '1.2em' }}>
            <Account
              createLoginConnector={scaffoldAppProviders.createLoginConnector}
              ensProvider={scaffoldAppProviders.mainnetProvider}
              hasContextConnect={true}
              blockExplorer={scaffoldAppProviders.targetNetwork.blockExplorer}
              price={price}
            />
          </div>
        </Header>
        <Content>{children}</Content>
        <Footer>
          <PageLayoutFooter
            price={price}
            scaffoldAppProviders={scaffoldAppProviders}
            gasPrice={gasPrice}
          />
        </Footer>
      </Layout>
    </>
  )
}
