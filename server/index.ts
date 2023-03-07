import express from "express";
import { setIntervalAsync, clearIntervalAsync } from "set-interval-async";
import ForwarderAbi from "./contracts/abi/Forwarder.json";
import { Forwarder } from "./contracts/address.json";
import cors from "cors";
import { ethers } from "ethers";

// Should be hidden in production
const PRIVATE_KEY =
  "0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e";

// create Wallet from private key and connect to Hardhat local network
const provider = ethers.getDefaultProvider("http://localhost:8545");
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const forwarderContract = new ethers.Contract(Forwarder, ForwarderAbi, wallet);
const interval = 30000;
let paymentInputs: any[] = [];

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.post("/relayTransaction", async (req, res) => {
  const { paymentInput } = req.body;
  paymentInputs.push(paymentInput);
  console.log(`sig received`, paymentInput);

  return res.json({ status: "success" });
});

app.get("/relayTransaction", (req, res) => {
  res.send(paymentInputs);
});

setIntervalAsync(async () => {
  try {
    if (paymentInputs.length != 0) {
      const gasLimit = (3000000).toString();
      // send transaction to forwarder contract
      const contractTx = await forwarderContract.payViaSignature(
        paymentInputs,
        {
          gasLimit,
        }
      );
      const transactionReceipt = await contractTx.wait(2);
      console.log(transactionReceipt.events.pop());
      paymentInputs = [];
    }
    console.log(`No Transactions at: `, new Date());
  } catch (e) {
    console.log(e);
    paymentInputs = [];
  }
}, interval);

app.listen(4000, () => console.log("listening on port 4000!"));
