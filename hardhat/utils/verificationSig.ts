import { ethers } from "ethers";
import { TokenA, Forwarder } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

// function to generate signature
export default async function getVerificationSignature(
  sender: SignerWithAddress,
  receiver: SignerWithAddress,
  token: TokenA,
  forwarder: Forwarder,
  value: BigNumber,
  deadline: BigNumber,
  nonce: BigNumber
) {
  const [name, version, chainId] = await Promise.all([
    "RelayerVerification",
    "1",
    1337,
  ]);

  return ethers.utils.splitSignature(
    await sender._signTypedData(
      {
        name,
        version,
        chainId,
        verifyingContract: forwarder.address,
      },
      {
        RelayerVerification: [
          {
            name: "sender",
            type: "address",
          },
          {
            name: "receiver",
            type: "address",
          },
          {
            name: "forwarder",
            type: "address",
          },
          {
            name: "token",
            type: "address",
          },
          {
            name: "value",
            type: "uint256",
          },
          {
            name: "nonce",
            type: "uint256",
          },
          {
            name: "deadline",
            type: "uint256",
          },
        ],
      },
      {
        sender: sender.address,
        receiver: receiver.address,
        forwarder: forwarder.address,
        token: token.address,
        value,
        nonce,
        deadline,
      }
    )
  );
}
