// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  console.log("Starting deployment:")
  const [deployer] = await ethers.getSigners();

   const Shop = await hre.ethers.getContractFactory("Shop");
  const shop = await Shop.deploy(deployer.address);

  await shop.deployed();
  console.log("Contract deployed:");

  console.log("Feeling shop with fruits:");
  // apple
  await shop.addFruit("Apple", "https://i.postimg.cc/Y4xBsDmc/apple-removebg-preview.png", 65, hre.ethers.utils.parseEther("0.5"));
  console.log("Feeling shop with fruits: added Apple")
  // orange
  await shop.addFruit("Orange", "https://i.postimg.cc/cg9ysKmX/banana-removebg-preview.png", 100, hre.ethers.utils.parseEther("1"));
  console.log("Feeling shop with fruits: added Orange")
  // banana
  await shop.addFruit("Banana", "https://i.postimg.cc/KkvhS7n1/orange-removebg-preview.png", 20, hre.ethers.utils.parseEther("0.25"));
  console.log("Feeling shop with fruits: added Banana")

  console.log("Shop contract deployed to: ", shop.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
