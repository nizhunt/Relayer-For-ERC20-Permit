import { ethers } from "ethers";

// function to generate signature
async function getPermitSignature(
  sender,
  token,
  forwarder,
  value,
  deadline,
  nonce
) {
  const [name, version, chainId, senderAddress] = await Promise.all([
    token.name(),
    "1",
    sender.getChainId(),
    sender.getAddress(),
  ]);
  // console.log(deadline, nonce, value.value);

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
        owner: senderAddress,
        spender: forwarder.address,
        value,
        nonce,
        deadline,
      }
    )
  );
}

export default getPermitSignature;
