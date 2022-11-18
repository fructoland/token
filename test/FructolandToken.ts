import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fructoland Token (FRLND)", function () {
  	async function deployFructoTokenFixture() {
		const [owner, otherAccount] = await ethers.getSigners();

		const FructoToken = await ethers.getContractFactory("FructolandToken");
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
			
			expect(await fructoToken.name()).to.equal("Fructoland Token");
		});

		it("Should have a symbol", async function () {
			const { fructoToken } = await loadFixture(deployFructoTokenFixture);

			expect(await fructoToken.symbol()).to.equal("FRLND");
		});
	});

	describe("Pausing", function () {
		it("Should be unpaused by default", async function () {
			const { fructoToken } = await loadFixture(deployFructoTokenFixture);

			expect(await fructoToken.paused()).to.be.false;
		});

		it("Should be able to be paused by the owner", async function () {
			const { fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.pause();

			expect(await fructoToken.paused()).to.be.true;
		});

		it("Should not be able to be paused by a non-owner", async function () {
			const { fructoToken, otherAccount } = await loadFixture(deployFructoTokenFixture);

			await expect(fructoToken.connect(otherAccount).pause()).to.be.revertedWith("Ownable: caller is not the owner");
		});

		it("Should be able to be unpaused by the owner", async function () {
			const { fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.pause();
			await fructoToken.unpause();

			expect(await fructoToken.paused()).to.be.false;
		});

		it("Should not be able to be unpaused by a non-owner", async function () {
			const { fructoToken, otherAccount } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.pause();

			await expect(fructoToken.connect(otherAccount).unpause()).to.be.revertedWith("Ownable: caller is not the owner");
		});

		it("Should not be able to transfer tokens when paused", async function () {
			const { fructoToken, owner } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.pause();

			await expect(fructoToken.transfer(owner.address, 1)).to.be.revertedWith("Pausable: paused");
		});

		it("Should not be able to mint tokens when paused", async function () {
			const { fructoToken, otherAccount } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.pause();

			await expect(fructoToken.mint(otherAccount.address, 1)).to.be.revertedWith("Pausable: paused");
		});

		it("Should not be able to burn tokens when paused", async function () {
			const { fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.pause();

			await expect(fructoToken.burn(1)).to.be.revertedWith("Pausable: paused");
		});
	});

	describe("Minting and burning", function () {
		it("Should allow owner to mint tokens", async function () {
			const { fructoToken, otherAccount } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.mint(otherAccount.address, 1000);

			expect(await fructoToken.balanceOf(otherAccount.address)).to.equal(1000);
		});

		it("Shouldn't allow users to mint tokens", async function () {
			const { fructoToken, otherAccount } = await loadFixture(deployFructoTokenFixture);

			await expect(fructoToken.connect(otherAccount)
						.mint(otherAccount.address, 1000)).to.be.revertedWith("Ownable: caller is not the owner");
		});

		it("Should allow holder to burn tokens", async function () {
			const { otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.transfer(otherAccount.address, ethers.utils.parseEther("10"));

			await fructoToken.connect(otherAccount).burn(ethers.utils.parseEther("10"));

			expect(await fructoToken.balanceOf(otherAccount.address)).to.equal(0);
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

	describe("Allowances", function () {
		it("Should set the allowance for delegated transfer", async function () {
			const { owner, otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.approve(otherAccount.address, ethers.utils.parseEther("10"));

			expect(await fructoToken.allowance(owner.address, otherAccount.address))
				.to.equal(ethers.utils.parseEther("10"));
		});

		it("Should change the allowance for delegated transfer", async function () {
			const { owner, otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.approve(otherAccount.address, ethers.utils.parseEther("10"));

			await fructoToken.approve(otherAccount.address, ethers.utils.parseEther("20"));

			expect(await fructoToken.allowance(owner.address, otherAccount.address))
				.to.equal(ethers.utils.parseEther("20"));
		});
	});

	describe("Delegated transfers", function () {
		it("Should transfer tokens between accounts", async function () {
			const { owner, otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.approve(otherAccount.address, ethers.utils.parseEther("10"));

			await fructoToken.connect(otherAccount)
				.transferFrom(owner.address, otherAccount.address, ethers.utils.parseEther("10"));

			expect(await fructoToken.balanceOf(otherAccount.address)).to.equal(ethers.utils.parseEther("10"));
		});

		it("Should fail if sender doesn't have enough tokens", async function () {
			const { owner, otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.approve(otherAccount.address, ethers.utils.parseEther("10"));

			await expect(fructoToken.connect(otherAccount)
						.transferFrom(owner.address, otherAccount.address, ethers.utils.parseEther("20")))
						.to.be.revertedWith("ERC20: insufficient allowance");
		});

		it("Should fail if sender doesn't have enough approved tokens", async function () {
			const { owner, otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.approve(otherAccount.address, ethers.utils.parseEther("10"));

			await expect(fructoToken.connect(otherAccount)
						.transferFrom(owner.address, otherAccount.address, ethers.utils.parseEther("20")))
						.to.be.revertedWith("ERC20: insufficient allowance");
		});
	});
});
