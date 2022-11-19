import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from 'dotenv';
dotenv.config();
import "@nomicfoundation/hardhat-toolbox";


const PRIVATE_KEY = process.env.PRIVATE_KEY!;
const API_URL = process.env.API_URL!;
const POLYGONSCAN_KEY = process.env.POLYGONSCAN_KEY!;

const config: HardhatUserConfig = {
  	solidity: "0.8.9",
  	networks: {
	  polygon: {
		  url: API_URL,
		  accounts: [PRIVATE_KEY],
	  },
	},
	etherscan: {
		apiKey: POLYGONSCAN_KEY,
	},
};

export default config;
