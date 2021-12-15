/* eslint-disable */

import { CameraOutlined, QrcodeOutlined } from '@ant-design/icons'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { Badge, Input } from 'antd'
import { useResolveEnsName } from 'eth-hooks/dapps'
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from 'react'

interface IAddressInputProps {
  autoFocus?: boolean
  ensProvider: StaticJsonRpcProvider | undefined
  placeholder?: string
  address: string | undefined
  onChange?: Dispatch<SetStateAction<string>>
  hideScanner?: boolean
}

/**
 * Displays an address input with QR scan option
  ~ Features ~
  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth") or you can enter directly ENS name instead of address
  - Provide placeholder="Enter address" value for the input
  - Value of the address input is stored in value={toAddress}
  - Control input change by onChange={setToAddress}
                          or onChange={address => { setToAddress(address);}}
 * @param props 
 * @returns  (FC)
 */
export const AddressInput: FC<IAddressInputProps> = (props) => {
  const [scan, setScan] = useState(false)

  const ensName = useResolveEnsName(props.ensProvider, props.address ?? '')

  const updateAddress = useCallback(
    async (newValue: string) => {
      if (newValue != null) {
        let address = newValue
        if (address.indexOf('.eth') > 0 || address.indexOf('.xyz') > 0) {
          try {
            const possibleAddress = await props.ensProvider?.resolveName?.(
              address
            )
            if (possibleAddress) {
              address = possibleAddress
            }
            // eslint-disable-next-line no-empty
          } catch (e) {}
        }
        if (props.onChange) {
          props.onChange(address)
        }
      }
    },
    [props.ensProvider, props.onChange]
  )

  return (
    <div>
      <Input
        id="0xAddress" // name it something other than address for auto fill doxxing
        name="0xAddress" // name it something other than address for auto fill doxxing
        autoComplete="off"
        autoFocus={props.autoFocus}
        placeholder={props.placeholder ? props.placeholder : 'address'}
        value={ensName || props.address}
        onChange={(e): void => {
          void updateAddress(e.target.value)
        }}
      />
    </div>
  )
}
