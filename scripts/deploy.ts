import hre from "hardhat";
import fs from 'fs'

async function main() {
const WKND = await hre.ethers.getContractFactory("WakandaToken");
  const wknd = await WKND.deploy();
  await wknd.deployed();

const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();
  await voting.deployed();

  let config = `
  export const wkndaddress = "${wknd.address}"
  export const votingaddress = "${voting.address}"
  `

  let data = JSON.stringify(config)
  fs.writeFileSync('config.js', JSON.parse(data))
  fs.writeFileSync('./server/config.ts', JSON.parse(data))
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });