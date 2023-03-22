"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const set_interval_async_1 = require("set-interval-async");
const Forwarder_json_1 = __importDefault(require("./contracts/abi/Forwarder.json"));
const address_json_1 = require("./contracts/address.json");
const cors_1 = __importDefault(require("cors"));
const ethers_1 = require("ethers");
// Should be hidden in production
const PRIVATE_KEY = "215aba83903d0bd8c3a81e59cea7143f27f009f247194207114eb150b471b9ea";
// create Wallet from private key and connect to Hardhat local network
const provider = ethers_1.ethers.getDefaultProvider("https://rpc-mumbai.maticvigil.com");
const wallet = new ethers_1.ethers.Wallet(PRIVATE_KEY, provider);
const forwarderContract = new ethers_1.ethers.Contract(address_json_1.Forwarder, Forwarder_json_1.default, wallet);
const interval = 30000;
let paymentInputs = [];
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
}));
app.use(express_1.default.json());
app.post("/relayTransaction", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentInput } = req.body;
    paymentInputs.push(paymentInput);
    console.log(`sig received`, paymentInput);
    return res.json({ status: "success" });
}));
app.get("/relayTransaction", (req, res) => {
    res.send(paymentInputs);
});
(0, set_interval_async_1.setIntervalAsync)(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (paymentInputs.length != 0) {
            const gasLimit = (3000000).toString();
            // send transaction to forwarder contract
            const contractTx = yield forwarderContract.payViaSignature(paymentInputs, {
                gasLimit,
            });
            const transactionReceipt = yield contractTx.wait(2);
            console.log(transactionReceipt.events.pop());
            paymentInputs = [];
        }
        console.log(`No Transactions at: `, new Date());
    }
    catch (e) {
        console.log(e);
        paymentInputs = [];
    }
}), interval);
app.listen(4000, () => console.log("listening on port 4000!"));
