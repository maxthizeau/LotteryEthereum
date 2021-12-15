import { FC } from 'react'
// import { ThemeSwitcher } from './components/ThemeSwitcher'
import 'antd/dist/antd.css'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import { HowToPlayPage } from './views/HowToPlayPage'

import { PageLayout } from 'src/components/PageLayout'

import { useEthersContext } from 'eth-hooks/context'
import { useBalance, useContractLoader, useGasPrice } from 'eth-hooks'
import { useDexEthPrice } from 'eth-hooks/dapps'
import { useScaffoldProviders as useScaffoldAppProviders } from 'src/hooks/useScaffoldAppProviders'
import { useBurnerFallback } from 'src/hooks/useBurnerFallback'
import { getNetworkInfo } from './helpers/getNetworkInfo'
import { useAppContracts } from './hooks/useAppContracts'

import { Lottery } from './views/Lottery'
import { Swap } from './views/Swap'
import { LotteryResult } from './views/LotteryResult'
import { LottyToken } from './generated/contract-types/LottyToken'
import { useSimpleContractReader } from './hooks/useSimpleContractReader'

const App: FC = () => {
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
  // const yourCurrentBalance = BigNumber.from(12)

  // const gasPrice = 1000000000
  const gasPrice = useGasPrice(
    ethersContext.chainId,
    'fast',
    getNetworkInfo(ethersContext.chainId)
  )

  const appContractConfig = useAppContracts()
  const readContracts = useContractLoader(appContractConfig)
  const writeContracts = useContractLoader(
    appContractConfig,
    ethersContext.signer
  )
  // console.log(scaffoldAppProviders.currentProvider)
  // console.log(ethersContext.chainId)
  // const gasPrice = useGasPrice(ethersContext.chainId, 'fast')
  // const mainnetContracts = useContractLoader(
  //   appContractConfig,
  //   scaffoldAppProviders.mainnetProvider,
  //   NETWORKS['mainnet'].chainId
  // )
  const userAddress = ethersContext.account

  const ltyBalance = useSimpleContractReader<string, LottyToken>(
    readContracts,
    'LottyToken',
    'balanceOf',
    [ethersContext.account],
    (_value) => _value.toString(),
    [{ ifIsUndefined: ethersContext.account, default: undefined }]
  )

  return (
    <>
      <PageLayout
        scaffoldAppProviders={scaffoldAppProviders}
        price={ethPrice}
        gasPrice={gasPrice ?? 0}
        ltyBalance={ltyBalance ?? '0'}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Lottery
                ethersContext={ethersContext}
                readContracts={readContracts}
                writeContracts={writeContracts}
                gasPrice={gasPrice}
                ltyBalance={ltyBalance ?? '0'}
                userAddress={userAddress ?? ''}
              />
            }
          />

          <Route
            path="/results"
            element={
              <LotteryResult
                readContracts={readContracts}
                writeContracts={writeContracts}
                gasPrice={gasPrice}
                ltyBalance={ltyBalance ?? '0'}
              />
            }
          />

          <Route
            path="/swap"
            element={<Swap yourCurrentBalance={yourCurrentBalance} />}
          />

          <Route
            path="/how-to-play"
            element={
              <HowToPlayPage
                ethersContext={ethersContext}
                readContracts={readContracts}
                writeContracts={writeContracts}
                gasPrice={gasPrice}
                ltyBalance={ltyBalance ?? '0'}
                userAddress={userAddress ?? ''}
              />
            }
          />
        </Routes>
      </PageLayout>
      {/* <ThemeSwitcher /> */}
    </>
  )
}

export default App
