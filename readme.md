# Simple Relayer


  - [Introduction](#introduction)
    - [Features](#features)
    - [Flow](#flow)
    - [Alternate Way of Implementation](#alternate-way-of-implementation)
      - [Pros](#pros)
      - [Cons](#cons)
    - [Further Scope of Improvement](#further-scope-of-improvement)
  - [Steps to Install](#steps-to-install)
    - [Clone to local](#clone-to-local)
    - [Start local blockchain](#start-local-blockchain)
    - [Deploy the smart contract to your local network](#deploy-the-smart-contract-to-your-local-network)
    - [Add Hardhat to your metamask networks](#add-hardhat-to-your-metamask-networks)
      - [Steps](#steps)
    - [Add accounts to Metamask](#add-accounts-to-metamask)
      - [Steps](#steps-1)
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

### Start local blockchain

---

```bash
cd hardhat
npm i
npx hardhat node
```

- a local development blockchain will run on http://127.0.0.1:8545/
- also you will get a list of all available accounts and their private keys

> IMPORTANT: your local network needs to run the whole time. Else the App won't function.

### Deploy the smart contract to your local network

---

Open another terminal window and switch to the hardhat folder to Run the deploy sript :

```bash
cd hardhat
npx hardhat run --network localhost scripts/deploy.ts
```

Now the smart contract has been deployed.

The following hardhat provided addresses are seeded with 10,000 tokens of deployed permit enabled ERC20 tokens: TokenA and TokenB to play around from the Front-end

```js
0x2546bcd3c84621e976d8185a91a922ae77ecec30,
  0xbda5747bfd65f08deb54cb465eb87d40e51b197e,
  0xdd2fd4581271e230360230f9337d5c0430bf44c0;
```

### Add Hardhat to your metamask networks

---

The second step to interact with your local development blockchain is to add it to your list of networks.

#### Steps

- click the circle in the top right again
- click on settings
- click on Networks
- click on Add Network
- Add Network name: Hardhat local
- New RPC URL: http://127.0.0.1:8545/
- ChainId: 1337

Now Metamask can connect to your local Network.

> Make sure, that you are on the Hardhat local network when using the app.

### Add accounts to Metamask

---

To interact with your local Blockchain you need the airdropped accounts.

#### Steps

- go to Metamask in the browser
- click the round circle in the top right
- click on import account
- copy one/all of the private keys (provided below) from the airdropped accounts (Account#16, Account#17, Account#18) and paste it into Metamask
- hit import

```js
Account #16: 0x2546BcD3c84621e976D8185a91A922aE77ECEc30 (10000 ETH)
Private Key: 0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0

Account #17: 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E (10000 ETH)
Private Key: 0x689af8efa8c651a91ad287602527f3af2fe9f6501a7ac4b061667b5a93e037fd

Account #18: 0xdD2FD4581271e230360230F9337D5c0430Bf44C0 (10000 ETH)
Private Key: 0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0
```

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
