import React from "react"
import ReactDOM from "react-dom/client"
import { createClient, WagmiConfig, configureChains, chain } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import App from "./App"
import "./index.css"

export const CHAIN = import.meta.env.DEV ? chain.hardhat : chain.polygon;

const { provider, webSocketProvider } = configureChains([CHAIN], [publicProvider()])

const client = createClient({
	provider,
	webSocketProvider,
	autoConnect: false,
	connectors: [
		new MetaMaskConnector({
			chains: [CHAIN],
		}),
		new CoinbaseWalletConnector({
			chains: [CHAIN],
			options: {
				appName: "Fructo Token"
			}
		}),
		new WalletConnectConnector({
			chains: [CHAIN],
		})
	]
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  	<WagmiConfig client={client}>
		<App />
	</WagmiConfig>
  </React.StrictMode>
)
