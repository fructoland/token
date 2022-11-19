import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fructo Token (FRCTO)", function () {
  	async function deployFructoTokenFixture() {
		const [owner, otherAccount] = await ethers.getSigners();

		const FructoToken = await ethers.getContractFactory("FructoToken");
		const fructoToken = await FructoToken.deploy();

    	return { owner, otherAccount, fructoToken };
  	}

	describe("Deployment", function () {
    	it("Should be successfully deployed", async function () {
    		const { fructoToken } = await loadFixture(deployFructoTokenFixture);
	
			expect(fructoToken.address).to.be.properAddress;
	    });

		it("Should have a name", async function () {
			const { fructoToken } = await loadFixture(deployFructoTokenFixture);
			
			expect(await fructoToken.name()).to.equal("Fructo Token");
		});

		it("Should have a symbol", async function () {
			const { fructoToken } = await loadFixture(deployFructoTokenFixture);

			expect(await fructoToken.symbol()).to.equal("FRCTO");
		});
	});

	describe("Transactions", function () {
		it("Should transfer tokens between accounts", async function () {
			const { otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.transfer(otherAccount.address, ethers.utils.parseEther("10"));

			expect(await fructoToken.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("10"));
		});

		it("Should fail if sender doesn't have enough tokens", async function () {
			const { owner, otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await expect(fructoToken.connect(otherAccount)
						.transfer(owner.address, ethers.utils.parseEther("10")))
						.to.be.revertedWith("ERC20: transfer amount exceeds balance");
		});

		it("Should update balances after transfers", async function () {
			const { owner, otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			const initialOwnerBalance = await fructoToken.balanceOf(owner.address);

			await fructoToken.transfer(otherAccount.address, ethers.utils.parseEther("10"));

			const finalOwnerBalance = await fructoToken.balanceOf(owner.address);

			expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(ethers.utils.parseEther("10")));
		});
	});
});
