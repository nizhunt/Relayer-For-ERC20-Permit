// functions to generate nonce

async function generateTokenNonce(paymentInputs, caller, token) {
  let callerAddress = await caller.getAddress();
  let nonce = await token.nonces(callerAddress);

  for (let i = 0; i < paymentInputs.length; i++) {
    const paymentInput = paymentInputs[i];

    if (
      paymentInput[0] === callerAddress &&
      paymentInput[4] === token.address
    ) {
      nonce = nonce.add("1");
    }
  }

  return nonce;
}

async function generateForwarderNonce(paymentInputs, caller, forwarder) {
  let callerAddress = await caller.getAddress();
  let nonce = await forwarder.nonces(callerAddress);

  for (let i = 0; i < paymentInputs.length; i++) {
    const paymentInput = paymentInputs[i];
    if (paymentInput[0] === callerAddress) {
      nonce = nonce.add("1");
    }
  }
  return nonce;
}

export { generateTokenNonce, generateForwarderNonce };
