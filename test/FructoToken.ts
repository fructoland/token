import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Fructo Token", function () {
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

			expect(await fructoToken.symbol()).to.equal("FSHARE");
		});

		it("Should have a total supply of 100 tokens", async function () {
			const { fructoToken } = await loadFixture(deployFructoTokenFixture);
			
			expect(await fructoToken.totalSupply()).to.equal(ethers.utils.parseEther("100"));
		});

		it("Should assign the total supply of tokens to the owner", async function () {
			const { owner, fructoToken } = await loadFixture(deployFructoTokenFixture);
			
			expect(await fructoToken.balanceOf(owner.address)).to.equal(await fructoToken.totalSupply());
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

	describe("Minting and burning", function () {
		it("Should allow owner to mint tokens", async function () {
			const { owner, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.mint(owner.address, ethers.utils.parseEther("10"));

			expect(await fructoToken.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("110"));
		});

		it("Should not allow non-owner to mint tokens", async function () {
			const { otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await expect(fructoToken.connect(otherAccount)
						.mint(otherAccount.address, ethers.utils.parseEther("10")))
						.to.be.revertedWith("Ownable: caller is not the owner");
		});

		it("Should allow holder to burn tokens", async function () {
			const { otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await fructoToken.transfer(otherAccount.address, ethers.utils.parseEther("10"));

			await fructoToken.connect(otherAccount).burn(ethers.utils.parseEther("10"));

			expect(await fructoToken.balanceOf(otherAccount.address)).to.equal(0);
			expect(await fructoToken.totalSupply()).to.equal(ethers.utils.parseEther("90"));
		});

		it("Should not allow non-holder to burn tokens", async function () {
			const { otherAccount, fructoToken } = await loadFixture(deployFructoTokenFixture);

			await expect(fructoToken.connect(otherAccount)
						.burn(ethers.utils.parseEther("10")))
						.to.be.revertedWith("ERC20: burn amount exceeds balance");
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
