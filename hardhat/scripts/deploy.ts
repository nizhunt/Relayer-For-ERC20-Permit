import hre from "hardhat";
import { writeFileSync } from "fs";

async function main() {
  const Forwarder = await hre.ethers.getContractFactory("Forwarder");
  const forwarder = await Forwarder.deploy();
  await forwarder.deployed();
  console.log(`Forwarder deployed to ${forwarder.address}`);

  const TokenA = await hre.ethers.getContractFactory("TokenA");
  const tokenA = await TokenA.deploy();
  await tokenA.deployed();
  console.log(`TokenA deployed to ${tokenA.address}`);

  const TokenB = await hre.ethers.getContractFactory("TokenB");
  const tokenB = await TokenB.deploy();
  await tokenB.deployed();
  console.log(`TokenB deployed to ${tokenB.address}`);

  writeFileSync(
    "../server/contracts/address.json",
    JSON.stringify(
      {
        Forwarder: forwarder.address,
        TokenA: tokenA.address,
        TokenB: tokenB.address,
      },
      null,
      "\t"
    )
  );

  writeFileSync(
    "../client/src/contracts/address.json",
    JSON.stringify(
      {
        Forwarder: forwarder.address,
        TokenA: tokenA.address,
        TokenB: tokenB.address,
      },
      null,
      "\t"
    )
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
