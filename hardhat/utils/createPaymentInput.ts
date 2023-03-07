import getPermitSignature from "../utils/permitSig";
import getVerificationSignature from "../utils/verificationSig";
import { generateForwarderNonce, generateTokenNonce } from "./generateNonce";
import { TokenA, Forwarder } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

export default async function createPaymentInput(
  sender: SignerWithAddress,
  receiver: SignerWithAddress,
  token: TokenA,
  forwarder: Forwarder,
  value: BigNumber,
  deadline: BigNumber,
  paymentInputs: any[]
) {
  const noncePermit = await generateTokenNonce(paymentInputs, sender, token);
  const nonceVerification = await generateForwarderNonce(
    paymentInputs,
    sender,
    forwarder
  );

  const {
    v: v1,
    r: r1,
    s: s1,
  } = await getPermitSignature(
    sender,
    token,
    forwarder,
    value,
    deadline,
    noncePermit
  );

  const {
    v: v2,
    r: r2,
    s: s2,
  } = await getVerificationSignature(
    sender,
    receiver,
    token,
    forwarder,
    value,
    deadline,
    nonceVerification
  );

  return [
    sender.address,
    receiver.address,
    value,
    deadline,
    token.address,
    v1,
    r1,
    s1,
    v2,
    r2,
    s2,
  ];
}
