import { ethers } from "ethers";
import { useEffect, useState } from "react";

declare global {
    interface Window {
        ethereum: any;
    }
}

export default function Mint() {
	const [currentAccount, setCurrentAccount] = useState("");

	const handleConnect = async () => {
		if (!("ethereum" in window)) {
			alert("Please install MetaMask to use this app.");
			return;
		}

		try {
			const provider = new ethers.providers.Web3Provider(window["ethereum"]);
			await provider.send("eth_requestAccounts", []);

			const signer = provider.getSigner();
			const address = await signer.getAddress();

			setCurrentAccount(address);
		} catch (error) {
			console.log(error);
		}
	}

	return currentAccount ? (
		<button style={{ display: "block", margin: "0 auto" }}>
			Mint
		</button>
	) : (
		<button 
			style={{ display: "block", margin: "0 auto" }}
			onClick={handleConnect}
		>
			Connect wallet
		</button>
	)
}
