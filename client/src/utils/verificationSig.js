import { ethers } from "ethers";

// function to generate signature
async function getVerificationSignature(
  sender,
  receiver,
  token,
  forwarder,
  value,
  deadline,
  nonce
) {
  const [name, version, chainId, senderAddress] = await Promise.all([
    "RelayerVerification",
    "1",
    sender.getChainId(),
    sender.getAddress(),
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
        sender: senderAddress,
        receiver,
        forwarder: forwarder.address,
        token: token.address,
        value,
        nonce,
        deadline,
      }
    )
  );
}

export default getVerificationSignature;
