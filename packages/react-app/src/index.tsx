import ReactDOM from 'react-dom'
import './index.css'

import App from './App'
import reportWebVitals from './reportWebVitals'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { BrowserRouter } from 'react-router-dom'

import { BLOCKNATIVE_DAPPID } from 'src/config/constants'
import { ErrorBoundary, ErrorFallback } from './components/ErrorFallback'
import { EthersAppContext } from 'eth-hooks/context'
import {
  EthComponentsSettingsContext,
  IEthComponentsSettings,
} from 'eth-components/models'
import { Suspense } from 'react'

import './themes/generated/main-theme.css'

// const themes = {
//   dark: `./dark-theme.css`,
//   light: `./light-theme.css`,
//   default: `./main-theme.css`,
// }
// console.log(process.env.PUBLIC_URL)
// const prevTheme =
//   typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null

const subgraphUri =
  'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract'

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
})

// create eth components context for options and API keys
const context: IEthComponentsSettings = {
  apiKeys: {
    BlocknativeDappId: BLOCKNATIVE_DAPPID,
  },
}

ReactDOM.render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <ApolloProvider client={client}>
      <EthComponentsSettingsContext.Provider value={context}>
        <EthersAppContext>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            {/* <ThemeSwitcherProvider
              themeMap={themes}
              defaultTheme={prevTheme || 'dark'}
            > */}

            <BrowserRouter>
              <Suspense fallback={<div />}>
                <App />
              </Suspense>
            </BrowserRouter>

            {/* </ThemeSwitcherProvider> */}
          </ErrorBoundary>
        </EthersAppContext>
      </EthComponentsSettingsContext.Provider>
    </ApolloProvider>
  </ErrorBoundary>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
