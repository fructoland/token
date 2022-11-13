import { ethers } from "hardhat";

async function main() {
	const FructoToken = await ethers.getContractFactory("FructoToken");
	const fructoToken = await FructoToken.deploy();

	console.log("FructoToken deployed to:", fructoToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
