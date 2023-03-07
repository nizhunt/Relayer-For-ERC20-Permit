import { ethers } from "ethers";
import { TokenA, Forwarder } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";

// function to generate signature
export default async function getPermitSignature(
  sender: SignerWithAddress,
  token: TokenA,
  forwarder: Forwarder,
  value: BigNumber,
  deadline: BigNumber,
  nonce: BigNumber
) {
  const [name, version, chainId] = await Promise.all([token.name(), "1", 1337]);

  return ethers.utils.splitSignature(
    await sender._signTypedData(
      {
        name,
        version,
        chainId,
        verifyingContract: token.address,
      },
      {
        Permit: [
          {
            name: "owner",
            type: "address",
          },
          {
            name: "spender",
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
        owner: sender.address,
        spender: forwarder.address,
        value,
        nonce,
        deadline,
      }
    )
  );
}
