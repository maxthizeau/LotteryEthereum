import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { Button } from 'antd'
import { useUserAddress } from 'eth-hooks'
import {
  CreateEthersModalConnector,
  useEthersContext,
  useBlockNumberContext,
} from 'eth-hooks/context'
import { Signer } from 'ethers'
import React, { FC, useState } from 'react'
// import { useThemeSwitcher } from 'react-css-theme-switcher'
import { useDebounce } from 'use-debounce'
import { useIsMounted } from 'usehooks-ts'

// import { Address, Balance, Wallet } from 'eth-components/ant'

export interface IAccountProps {
  ensProvider: StaticJsonRpcProvider | undefined
  localProvider?: StaticJsonRpcProvider | undefined
  createLoginConnector?: CreateEthersModalConnector
  /**
   * if hasContextConnect is true, it will not use this variable
   */
  signer?: Signer
  /**
   * if hasContextConnect = false, do not use context or context connect/login/logout.  only used passed in address.  defaults={false}
   */
  hasContextConnect: boolean
  fontSize?: number
  blockExplorer: string
  price: number
}

/**
  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

    ~ Features ~
  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
 * @param props
 * @returns (FC)
 */
export const Account: FC<IAccountProps> = (props: IAccountProps) => {
  const blockNumber = useBlockNumberContext()
  const ethersContext = useEthersContext()
  const showLoadModal = !ethersContext.active
  const [connecting, setConnecting] = useState(false)

  const isMounted = useIsMounted()
  const [loadingButton, loadingButtonDebounce] = useDebounce(connecting, 1000, {
    maxWait: 1500,
  })

  if (loadingButton && connecting) {
    setConnecting(false)
  }

  const address = useUserAddress(props.signer)
  // if hasContextConnect = false, do not use context or context connect/login/logout.  only used passed in address
  const [resolvedAddress] = useDebounce<string | undefined>(
    props.hasContextConnect ? ethersContext.account : address,
    200,
    {
      trailing: true,
    }
  )

  const [resolvedSigner] = useDebounce<Signer | undefined>(
    props.hasContextConnect ? ethersContext.signer : props.signer,
    200,
    {
      trailing: true,
    }
  )

  const handleLoginClick = (): void => {
    if (props.createLoginConnector != null) {
      const connector = props.createLoginConnector?.()
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
      {showLoadModal && props.createLoginConnector && (
        <Button
          loading={loadingButtonDebounce.isPending()}
          key="loginbutton"
          style={{ alignSelf: 'center', marginLeft: 8 }}
          onClick={handleLoginClick}
        >
          Connect
        </Button>
      )}
    </>
  )

  const logoutButton = (
    <>
      {!showLoadModal && props.createLoginConnector && (
        <Button
          key="logoutbutton"
          style={{ alignSelf: 'center', marginLeft: 8 }}
          // shape="round"
          // size="large"
          onClick={ethersContext.disconnectModal}
        >
          Logout
        </Button>
      )}
    </>
  )

  const display = (
    <>
      {resolvedAddress != null && (
        <>
          <div
            style={{
              alignContent: 'center',
              display: 'flex',
              flexDirection: 'column',
              margin: '0 10px',
            }}
          >
            <div style={{ fontSize: '0.75em', lineHeight: '1.2em' }}>
              Connected as
            </div>
            <br />

            <a
              href={`${props.blockExplorer}/${resolvedAddress}`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.9em', lineHeight: '1.4em' }}
            >
              {resolvedAddress.substr(0, 5) +
                '...' +
                resolvedAddress.substr(-2)}
            </a>
          </div>

          {/* <Address
            punkBlockie
            address={resolvedAddress}
            fontSize={props.fontSize}
            ensProvider={props.ensProvider}
            blockExplorer={props.blockExplorer}
            minimized={false}
          />
          <Balance address={resolvedAddress} price={props.price} />
          {resolvedSigner && (
            <Wallet
              signer={resolvedSigner}
              ensProvider={props.ensProvider}
              localProvider={props.localProvider}
              price={props.price}
              color={'#1890ff'}
            />
          )} */}
        </>
      )}
    </>
  )

  return (
    <div style={{ display: 'flex', alignContent: 'center' }}>
      {display}
      {props.hasContextConnect && (
        <>
          {loadModalButton}
          {logoutButton}
        </>
      )}
    </div>
  )
}
