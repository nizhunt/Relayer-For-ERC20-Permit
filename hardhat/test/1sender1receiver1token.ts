import { ethers } from "hardhat";
const { utils } = ethers;
import { expect } from "chai";
import { TokenA, Forwarder, ForwarderDatatype } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import createPaymentInput from "../utils/createPaymentInput";

let Token, token: TokenA, Forwarder, forwarder: Forwarder;

let deployer: SignerWithAddress,
  sender: SignerWithAddress,
  relayer: SignerWithAddress,
  receiver1: SignerWithAddress,
  receiver2: SignerWithAddress;

describe("One Sender One Receiver One Token", () => {
  before(async () => {
    [deployer, sender, relayer, receiver1, receiver2] =
      await ethers.getSigners();

    Token = await ethers.getContractFactory("TokenA");
    token = await Token.deploy();
    await token.deployed();

    // the deployer has the token that can be used as payment
    await token.mint(sender.address, utils.parseEther("50"));

    Forwarder = await ethers.getContractFactory("Forwarder");
    forwarder = await Forwarder.deploy();
    await forwarder.deployed();
  });

  describe("Make single payment", async () => {
    // Payer is paying 10 tokens
    it("Sender should be able to relay payment transaction to relayer", async () => {
      let paymentInputs: any[] = [];

      const value = utils.parseEther("10");
      const deadline = ethers.constants.MaxUint256;

      const newPaymentInput = await createPaymentInput(
        sender,
        receiver1,
        token,
        forwarder,
        value,
        deadline,
        paymentInputs
      );

      paymentInputs.push(newPaymentInput);

      await forwarder.connect(relayer).payViaSignature(paymentInputs);

      expect(await token.balanceOf(sender.address)).to.be.eq(
        utils.parseEther("40")
      );
      expect(await token.balanceOf(receiver1.address)).to.be.eq(
        utils.parseEther("10")
      );
    });
  });
});
