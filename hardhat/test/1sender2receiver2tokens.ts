import { ethers } from "hardhat";
const { utils } = ethers;
import { expect } from "chai";
import { TokenA, Forwarder, ForwarderDatatype } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import createPaymentInput from "../utils/createPaymentInput";

let TokenA,
  tokenA: TokenA,
  TokenB,
  tokenB: TokenA,
  Forwarder,
  forwarder: Forwarder;

let deployer: SignerWithAddress,
  sender1: SignerWithAddress,
  sender2: SignerWithAddress,
  relayer: SignerWithAddress,
  receiver1: SignerWithAddress,
  receiver2: SignerWithAddress;

describe("single sender, multiple receiver, multiple token", () => {
  before(async () => {
    [deployer, sender1, sender2, relayer, receiver1, receiver2] =
      await ethers.getSigners();

    TokenA = await ethers.getContractFactory("TokenA");
    tokenA = await TokenA.deploy();
    await tokenA.deployed();

    TokenB = await ethers.getContractFactory("TokenB");
    tokenB = await TokenB.deploy();
    await tokenB.deployed();

    Forwarder = await ethers.getContractFactory("Forwarder");
    forwarder = await Forwarder.deploy();
    await forwarder.deployed();
  });

  describe("sending the transaction", async () => {
    // Payer is paying 10 tokens
    it("relayer should be able to relay payment", async () => {
      await tokenA.mint(sender1.address, utils.parseEther("50"));
      await tokenB.mint(sender1.address, utils.parseEther("50"));

      let paymentInputs: any[] = [];

      const value1 = utils.parseEther("10");
      const deadline = ethers.constants.MaxUint256;
      const paymentInput1 = await createPaymentInput(
        sender1,
        receiver1,
        tokenA,
        forwarder,
        value1,
        deadline,
        paymentInputs
      );

      paymentInputs.push(paymentInput1);

      const value2 = utils.parseEther("20");

      const paymentInput2 = await createPaymentInput(
        sender1,
        receiver2,
        tokenB,
        forwarder,
        value2,
        deadline,
        paymentInputs
      );

      paymentInputs.push(paymentInput2);

      await forwarder.connect(relayer).payViaSignature(paymentInputs);

      expect(await tokenA.balanceOf(sender1.address)).to.be.eq(
        utils.parseEther("40")
      );

      expect(await tokenA.balanceOf(receiver1.address)).to.be.eq(
        utils.parseEther("10")
      );
      expect(await tokenB.balanceOf(sender1.address)).to.be.eq(
        utils.parseEther("30")
      );

      expect(await tokenB.balanceOf(receiver2.address)).to.be.eq(
        utils.parseEther("20")
      );
    });
  });
});
