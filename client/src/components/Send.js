import { useState } from "react";
import { ethers } from "ethers";

import addresses from "../contracts/address.json";
import forwarderABI from "../contracts/abi/Forwarder.json";
import tokenABI from "../contracts/abi/TokenA.json";
import createPaymentInput from "../utils/createPaymentInput";
import axios from "axios";

const Send = ({ state, isConnected }) => {
  const [inprogress, setInprogress] = useState(false);

  const sendPaymentInput = async (event) => {
    event.preventDefault();
    setInprogress(true);
    let paymentInputs;
    try {
      const res = await axios.get("http://localhost:4000/relayTransaction");
      paymentInputs = res.data;
    } catch (e) {
      alert(e);
    }

    const tokenAddress = document.querySelector("#tokenAddress").value;
    const receiver = document.querySelector("#to").value;
    const amount = document.querySelector("#amount").value;
    const amountFormatted = ethers.utils.parseEther(amount);
    const deadline = ethers.constants.MaxUint256;
    let canSend = false;

    for (const key in addresses) {
      if (tokenAddress === addresses[key]) {
        canSend = true;
      }
    }

    if (!canSend) {
      alert("Token not available on the network");
    } else {
      const token = new ethers.Contract(tokenAddress, tokenABI, state.signer);
      const forwarder = new ethers.Contract(
        addresses.Forwarder,
        forwarderABI,
        state.signer
      );

      const senderAddress = await state.signer.getAddress();

      const balance = await token.balanceOf(senderAddress);

      if (balance.lte(amountFormatted)) {
        canSend = false;
        alert("Not enough balance");
      } else {
        const paymentInput = await createPaymentInput(
          state.signer,
          receiver,
          token,
          forwarder,
          amountFormatted,
          deadline,
          paymentInputs
        );

        const post = { paymentInput: paymentInput };
        try {
          const res = await axios.post(
            "http://localhost:4000/relayTransaction",
            post
          );
          alert("Success! Signature Sent");
        } catch (e) {
          alert(e);
        }
      }
    }
    setInprogress(false);
  };
  return (
    <>
      <div className="container-md" style={{ width: "50%", marginTop: "25px" }}>
        <form onSubmit={sendPaymentInput}>
          <div className="mb-3">
            <label className="form-label">Token</label>
            <input
              type="text"
              className="form-control"
              id="tokenAddress"
              required
              placeholder="Enter Permit-Enabled Token Address"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">To</label>
            <input
              type="text"
              className="form-control"
              required
              id="to"
              placeholder="Enter Receiver Address"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Value</label>
            <input
              type="text"
              className="form-control"
              required
              id="amount"
              placeholder="Enter Number Of Tokens"
            />
          </div>
          <div className="text-center">
            {inprogress ? (
              <button className="btn btn-primary" type="button" disabled>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>{" "}
                Please sign through wallet
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!isConnected}
              >
                Sign Two Signatures And Send
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
export default Send;
