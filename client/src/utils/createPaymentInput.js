import getPermitSignature from "../utils/permitSig.js";
import getVerificationSignature from "../utils/verificationSig.js";
import {
  generateForwarderNonce,
  generateTokenNonce,
} from "../utils/generateNonce.js";

async function createPaymentInput(
  sender,
  receiver,
  token,
  forwarder,
  value,
  deadline,
  paymentInputs
) {
  const noncePermit = await generateTokenNonce(paymentInputs, sender, token);
  const nonceVerification = await generateForwarderNonce(
    paymentInputs,
    sender,
    forwarder
  );
  const senderAddress = await sender.getAddress();

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
    senderAddress,
    receiver,
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
export default createPaymentInput;
