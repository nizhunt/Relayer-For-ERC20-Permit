import { TokenA, Forwarder } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

export async function generateTokenNonce(
  paymentInputs: any[],
  caller: SignerWithAddress,
  token: TokenA
) {
  var nonce = await token.nonces(caller.address);

  for (let i = 0; i < paymentInputs.length; i++) {
    const paymentInput = paymentInputs[i];
    if (paymentInput[0] == caller.address && paymentInput[4] == token.address) {
      var one = BigNumber.from("1");
      nonce = nonce.add(one);
    }
  }
  return nonce;
}

export async function generateForwarderNonce(
  paymentInputs: any[],
  caller: SignerWithAddress,
  forwarder: Forwarder
) {
  var nonce = await forwarder.nonces(caller.address);

  for (let i = 0; i < paymentInputs.length; i++) {
    const paymentInput = paymentInputs[i];

    if (paymentInput[0] == caller.address) {
      var one = BigNumber.from("1");
      nonce = nonce.add(one);
    }
  }
  return nonce;
}
