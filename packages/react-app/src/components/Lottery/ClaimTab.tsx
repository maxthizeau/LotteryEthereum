import { formatEther } from '@ethersproject/units'
import { Spin, Button } from 'antd'
import { Balance } from '../../views/Lottery'
import { round } from '../../helpers/utils'
import { COIN_NAME } from 'src/config/constants'
import { FC, useState } from 'react'

interface IClaimTabProps {
  claimFunction: () => Promise<void>
  claimableAmount: string | undefined
}

const ClaimTab: FC<IClaimTabProps> = ({
  claimFunction,
  claimableAmount,
}: IClaimTabProps) => {
  const [loading, setLoading] = useState(false)

  const onClaim = async (): Promise<void> => {
    setLoading(true)
    await claimFunction()
    setLoading(false)
  }

  return (
    <>
      <Balance>
        💰 You earned :{' '}
        {claimableAmount
          ? round(Number(formatEther(claimableAmount)), 6)
          : 'Loading...'}{' '}
        {COIN_NAME}
      </Balance>
      <Button
        type="primary"
        style={{
          width: '100%',
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          margin: '20px auto',
        }}
        onClick={onClaim}
        disabled={
          typeof claimableAmount === undefined || Number(claimableAmount) <= 0
        }
      >
        {loading ? <Spin /> : `Claim all`}
      </Button>
    </>
  )
}

export default ClaimTab
