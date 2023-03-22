# AutoMata Task - Simple Relayer

- [AutoMata Task - Simple Relayer](#automata-task---simple-relayer)
  - [Introduction](#introduction)
    - [Features](#features)
    - [Flow](#flow)
    - [Alternate Way of Implementation](#alternate-way-of-implementation)
      - [Pros](#pros)
      - [Cons](#cons)
    - [Further Scope of Improvement](#further-scope-of-improvement)
  - [Steps to Install](#steps-to-install)
    - [Clone to local](#clone-to-local)
    - [Deploy the smart contract to Mumbai Testnet](#deploy-the-smart-contract-to-mumbai-testnet)
    - [Run the Relayer](#run-the-relayer)
    - [Run the app](#run-the-app)

## Introduction

---

CLIENT ==> RELAYER ==> BLOCKCHAIN[ FORWARDER ==> ERC20 TOKEN]

---

### Features

- All ERC20 Permit tokens are supported
- Relayers are trustless, can't change the recipient or other parameters from the transaction signature
- All signatures are nonce verified and can't be replayed

### Flow

- User signs two signatures from Front-End and sends it to the relayer, one for relayer verification and other for ERC20 Permit
- Trustless Relayer bundles multiple such transactions and sends it every 30 seconds to the forwarder
- Forwarder contract verifies the incoming bundle of transactions to have senders address and parameters as intended by the sender to make sure the relayer has not changed any data
- Forwarder sends each individual signatures to ERC20 contracts and then transfers the coins

### Alternate Way of Implementation

In this implementation we leverage the new `Permit` feature of ERC20 tokens. The other way to implement a relayer is by using ERC2771 Meta Transaction which would have the following pros and cons:

#### Pros

- No need for two signatures
- Cheaper gas consumption per transaction

#### Cons

- Each ERC20 token has to be aware of the forwarder address(ERC2771 Context) to use the relayer service, stopping the general use by all ERC20s

### Further Scope of Improvement

- Database integration in server for persistence of data
- Listen to Forwarder events to list individual transfer failures to show the user
- 100% test coverage of smart contract
- Better UX implementation for signing two signatures
- The Graph integration for faster read operations of smart contract
- Better gas estimation techniques for sending relayer transactions

## Steps to Install

---

### Clone to local

---

```bash
git clone <REPO-URL>
cd submission
```

### Deploy the smart contract to Mumbai Testnet

---

Open a terminal window and switch to the hardhat folder to Run the deploy script :

```bash
cd hardhat
npx hardhat run --network polygon_mumbai scripts/deploy.ts
```

Now the smart contract has been deployed.

The following hardhat provided address is seeded with 100 tokens of deployed permit enabled ERC20 tokens: TokenA and TokenB and some extra test matics to play around from the Front-end

> Address:
> 0x0B950D128F6a33651257F95cbAF59c02b7F6019F
>
> Private-key: 215aba83903d0bd8c3a81e59cea7143f27f009f247194207114eb150b471b9ea

> Make sure, that you are on the Mumbai test network when using the app.

### Run the Relayer

---

Open another terminal window to run the server (relayer)

```bash
cd server
npm i
npm start
```

### Run the app

---

Open another terminal window and type:

```bash
cd client
npm i
npm start
```

Now your browser will open and you can use the App.
