export default function Mint() {
	return true ? (
		<button style={{ display: "block", margin: "0 auto" }}>
			Mint
		</button>
	) : (
		<button>
			Connect wallet
		</button>
	)
}
