import express from "express";
import { setIntervalAsync, clearIntervalAsync } from "set-interval-async";
import ForwarderAbi from "./contracts/abi/Forwarder.json";
import { Forwarder } from "./contracts/address.json";
import cors from "cors";
import { ethers } from "ethers";

// Should be hidden in production
const PRIVATE_KEY =
  "215aba83903d0bd8c3a81e59cea7143f27f009f247194207114eb150b471b9ea";

// create Wallet from private key and connect to Hardhat local network
const provider = ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com");
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
