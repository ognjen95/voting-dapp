import "@nomiclabs/hardhat-waffle";
import fs from "fs";

const privateKey = fs.readFileSync(".secret").toString();
const projectId = "b7dd9d8cb0564c538476aa4f11b4d012"; // this should go in .env

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    // rinkeby: {
    //   url: "https://rinkeby.infura.io/v3/345cca76a2414be0b86607b5db4b62dc",
    //   accounts: [privateKey]
    // },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
