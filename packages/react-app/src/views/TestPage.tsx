import { Col, Row, Button } from 'antd'
// import { ALCHEMY_KEY, NETWORKS } from 'src/config/constants'

import { useEthersContext } from 'eth-hooks/context'
import {
  // useGasPrice,
  // useContractLoader,
  // useContractReader,
  useBalance,
  // useUserAddress,
} from 'eth-hooks'
import { useDexEthPrice } from 'eth-hooks/dapps'
import { Address } from 'eth-components/ant'
import { useScaffoldProviders as useScaffoldAppProviders } from 'src/hooks/useScaffoldAppProviders'
import { useBurnerFallback } from 'src/hooks/useBurnerFallback'
import { toEth } from 'src/helpers/utils'
import { useState } from 'react'
import { useDebounce } from 'use-debounce/lib'
import { useIsMounted } from 'usehooks-ts'

const TestPage = (): React.ReactElement => {
  // 🛰 providers
  // see useLoadProviders.ts for everything to do with loading the right providers
  const scaffoldAppProviders = useScaffoldAppProviders()

  // 🦊 Get your web3 ethers context from current providers
  const ethersContext = useEthersContext()

  // if no user is found use a burner wallet on localhost as fallback if enabled
  useBurnerFallback(scaffoldAppProviders, true)

  const ethPrice = useDexEthPrice(
    scaffoldAppProviders.mainnetProvider,
    scaffoldAppProviders.targetNetwork
  )

  const yourCurrentBalance = useBalance(ethersContext.account ?? '')

  // const yourCurrentBalance = 0
  const address = ethersContext?.account ?? ''

  const showLoadModal = !ethersContext.active
  const [connecting, setConnecting] = useState(false)
  const [loadingButton, loadingButtonDebounce] = useDebounce(connecting, 1000, {
    maxWait: 1500,
  })
  const isMounted = useIsMounted()

  const handleLoginClick = (): void => {
    if (scaffoldAppProviders.createLoginConnector != null) {
      const connector = scaffoldAppProviders.createLoginConnector?.()
      if (!isMounted()) {
        console.log('openModal: no longer mounted')
      } else if (connector) {
        setConnecting(true)
        ethersContext.openModal(connector)
      } else {
        console.warn('openModal: A valid EthersModalConnector was not provided')
      }
    }
  }

  const loadModalButton = (
    <>
      {showLoadModal && scaffoldAppProviders.createLoginConnector && (
        <Button
          loading={loadingButtonDebounce.isPending()}
          key="loginbutton"
          style={{ verticalAlign: 'top', marginLeft: 8, marginTop: 4 }}
          shape="round"
          size="large"
          onClick={handleLoginClick}
        >
          connect
        </Button>
      )}
    </>
  )

  return (
    <div
      style={{
        border: '1px solid #cccccc',
        padding: 32,
        width: 600,
        margin: 'auto',
        marginTop: 64,
      }}
    >
      <h2>Debug page</h2>
      {/* <Button onClick={}>Connect !</Button> */}
      {/* <Button onClick={logoutOfWeb3Modal}>Log out !</Button> */}
      <Row>
        <Col span="24">
          <b>Address : </b> {address}
        </Col>
        <Col span="24">
          <b>Local Chain Id : </b> {}
        </Col>
        <Col span="24">
          <b>Selected Chain Id : </b> {ethersContext.chainId}
        </Col>
        <Col span="24">
          <b>Balance : </b> {toEth(yourCurrentBalance)}
        </Col>
        <Col span="24">
          <b>Eth Price : </b> {ethPrice}
        </Col>
        <Col span="24">
          <Address
            address={address} /* this will show as austingriffith.eth */
            ensProvider={scaffoldAppProviders.mainnetProvider}
            fontSize={16}
          />
          <Button onClick={ethersContext.disconnectModal}>
            DisconnectModal
          </Button>
          <Button onClick={ethersContext.deactivate}>Deactivate</Button>
          {loadModalButton}
        </Col>
      </Row>
    </div>
  )
}

export default TestPage
