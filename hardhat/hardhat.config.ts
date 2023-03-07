require("@nomicfoundation/hardhat-toolbox");
require("hardhat-abi-exporter");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  abiExporter: {
    path: "./client/src/contracts/abi" && "./server/contracts/abi",
    runOnCompile: true,
    clear: true,
    flat: true,
  },
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: [5000, 6000],
      },
    },
  },
};
