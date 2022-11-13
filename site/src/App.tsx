import "./App.css";
import tokenImage from "./assets/token.png";
import Footer from "./components/Footer";

export default function App() {
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

		<div className="card">
			<p>				
				⚠️ At the moment, the Fructo Token is not yet mintable. This means that you
				cannot mint new tokens. Access to Fructo Tokens is limited to the
				community members who have been invited to the Fructo DAO.
			</p>
		</div>

		<br />

		<div className="card">
			<p>
				📜 The Fructo Token is an ERC-20 token that is deployed on the Polygon
				network. The token contract address is{" "}
				<a
					// href="https://polygonscan.com/address/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"
					target="_blank"
					rel="noreferrer"
				>
					(NOT YET DEPLOYED)
				</a>.
				You can use the Fructo Token to vote in the Fructo DAO.
				The more tokens you have, the more voting power you have.
			</p>
		</div>
		<Footer />
    </main>
  )
}
