import React from "react"
import ReactDOM from "react-dom/client"
import { createClient, WagmiConfig, configureChains, chain } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import App from "./App"
import "./index.css"

export const CHAIN = import.meta.env.DEV ? chain.hardhat : chain.polygon;

const { provider, webSocketProvider } = configureChains([CHAIN], [publicProvider()])

const client = createClient({
	provider,
	webSocketProvider,
	autoConnect: false
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  	<WagmiConfig client={client}>
		<App />
	</WagmiConfig>
  </React.StrictMode>
)
