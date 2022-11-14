import { useState } from "react";
import { abi } from "../assets/abi.json";
import { useAccount, useConnect, useNetwork, useSwitchNetwork, usePrepareContractWrite, useContractWrite } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { BigNumber, ethers } from "ethers";
import {CHAIN} from "../main";

interface Props {
	mintingFee: BigNumber;
	isMintingFeeError: boolean;
	isMintingFeeLoading: boolean;
}

export default function Mint({ mintingFee, isMintingFeeError, isMintingFeeLoading }: Props) {
	const [ amount, setAmount ] = useState(1);
	const { isConnected, address } = useAccount();
	const { connect, isLoading: isAccountLoading } = useConnect({
		connector: new InjectedConnector()
	});

	const { chain } = useNetwork()

	const { switchNetwork, isLoading: isSwitchingLoading } = useSwitchNetwork({
		chainId: CHAIN.id
	});
	const { config } = usePrepareContractWrite({
		address: import.meta.env.VITE_CONTRACT_ADDRESS,
		abi,
		functionName: "mint",
		args: [amount],
		overrides: {
			value: mintingFee.mul(amount)
		}
	});
	const { write: startTransaction, isLoading: isMintingLoading } = useContractWrite(config);

	return isConnected && address ? (
		<>
			{chain?.network !== CHAIN.network ? (
				<>
					<p 
						style={{
							color: "red",
							textAlign: "center"
						}}
					>
						You are connected to the {chain?.name} network. Please switch to the
						Polygon network to mint tokens.
					</p>
					{switchNetwork && (
						<button
							onClick={() => switchNetwork()}
							disabled={isSwitchingLoading}
							style={{
								display: "block",
								margin: "0 auto",
								marginTop: ".5rem"
							}}
						>
							{isSwitchingLoading ? "Switching..." : "Switch Network"}
						</button>
					)}
				</>
			) : (
				<p
					style={{
						textAlign: "center",
					}}
				>
					Connected as {address.slice(0, 6)}...{address.slice(-4)}
				</p>
			)}
			<p
				style={{
					textAlign: "center"
				}}
			>
				{isMintingFeeLoading ?
					"Loading minting fee..." :
					isMintingFeeError ?
						"Error loading minting fee" :
						`Minting fee: ${ethers.utils.formatEther(mintingFee as BigNumber)} MATIC`
				}
			</p>
			<input
				type="number"
				value={amount}
				onChange={e => setAmount(parseInt(e.target.value) || 1)}
				style={{
					display: "block",
					margin: "0 auto",
					marginTop: ".5rem"
				}}
			/>
			<button 
				style={{ display: "block", margin: "0 auto", marginTop: ".5rem" }}
				disabled={chain?.network !== CHAIN.network || !startTransaction || isMintingLoading ? true : false}
				onClick={() => startTransaction?.()}
			>
				{isMintingLoading ? "Minting..." : "Mint"}
			</button>
		</>
	) : (
		<button 
			style={{ display: "block", margin: "0 auto" }}
			onClick={() => connect()}
			disabled={isAccountLoading}
		>
			{isAccountLoading ? "Connecting..." : "Connect Wallet"}
		</button>
	)
}
