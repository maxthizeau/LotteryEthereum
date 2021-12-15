import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { Skeleton, Typography } from 'antd'
import { useResolveEnsName } from 'eth-hooks/dapps'
import React, { FC } from 'react'

// changed value={address} to address={address}

const { Text, Link } = Typography

const blockExplorerLink = (address: string, blockExplorer?: string): string =>
  `${blockExplorer || 'https://etherscan.io/'}${'address/'}${address}`

interface IAddressProps {
  punkBlockie?: boolean
  ensProvider?: StaticJsonRpcProvider | undefined
  blockExplorer?: string
  address: string
  fontSize?: number
  minimized?: boolean
  size?: 'short' | 'long'
  noLink?: boolean
  hideCopy?: boolean
  onChange?: () => void
}

/**
 * Displays an address with a blockie image and option to copy address

  ~ Features ~
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
 * @param props
 * @returns (FC)
 */
export const Address: FC<IAddressProps> = ({
  minimized = false,
  punkBlockie = false,
  size = 'short',
  ...rest
}) => {
  const props = { ...rest, size, minimized, punkBlockie }
  const address = props.address
  let ensName: string = ''

  ensName = useResolveEnsName(props.ensProvider, address)

  if (!address) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    )
  }

  let displayAddress = address.substr(0, 6)

  const ensSplit = ensName && ensName.split('.')
  const validEnsCheck = ensSplit && ensSplit[ensSplit.length - 1] === 'eth'

  if (validEnsCheck) {
    displayAddress = ensName
  } else if (props.size === 'short') {
    displayAddress += '...' + address.substr(-4)
  } else if (props.size === 'long') {
    displayAddress = address
  }

  const etherscanLink = blockExplorerLink(address, props.blockExplorer)

  const copyable = props.hideCopy ? undefined : { text: address }

  const text = (
    <>
      <Link
        style={{ color: '#ddd' }}
        editable={props.onChange ? { onChange: props.onChange } : false}
        copyable={copyable}
        href={etherscanLink}
        target="_blank"
      >
        {displayAddress}
      </Link>
    </>
  )

  return (
    <span style={{ position: 'relative' }}>
      <span
        style={{
          verticalAlign: 'middle',
          paddingLeft: 5,
          fontSize: props.fontSize ? props.fontSize : 28,
        }}
      >
        {text}
      </span>
    </span>
  )
}
