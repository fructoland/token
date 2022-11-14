import "./App.css";
import { abi } from "./assets/abi.json";
import Mint from "./components/Mint";
import { useContractRead } from "wagmi";
import tokenImage from "./assets/token.png";
import Footer from "./components/Footer";
import {BigNumber} from "ethers";


export default function App() {
	const { data: mintingFee, isLoading: isMintingFeeLoading, isError: isMintingFeeError } = useContractRead({
		address: import.meta.env.VITE_CONTRACT_ADDRESS,
		abi,
		functionName: "getMintingFee"
	});
	
	return (
		<main>
			<div className="header">
				<img
					src={tokenImage}
					className="token"
				/>
				<h1>Fructo Token</h1>
				<p>
					Welcome to the Fructo Token. This is a simple ERC-20 token that you can
					use to vote in the Fructo DAO.
				</p>
			</div>

			<br />

			{mintingFee ? (
				<Mint 
					mintingFee={mintingFee as BigNumber}
					isMintingFeeError={isMintingFeeError}
					isMintingFeeLoading={isMintingFeeLoading}
				/>
			) : null}

			<br />

			<div className="card">
				<p>
					📜 The Fructo Token is an ERC-20 token that is deployed on the Polygon
					network. The token contract address is{" "}
					<a
						href={`https://polygonscan.com/address/${import.meta.env.VITE_CONTRACT_ADDRESS}`}
						target="_blank"
						rel="noreferrer"
					>
						{import.meta.env.VITE_CONTRACT_ADDRESS}
					</a>.
					You can use the Fructo Token to vote in the Fructo DAO.
					The more tokens you have, the more voting power you have.
				</p>
			</div>
			<Footer />
		</main>
  	);
}
