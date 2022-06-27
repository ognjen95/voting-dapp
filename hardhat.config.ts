import "@nomiclabs/hardhat-waffle";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    // hardhat: {
    //   chainId: 1337,
    // },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/345cca76a2414be0b86607b5db4b62dc",
      accounts: ["0xf1a9b46b4c8d1e539f596543a96b0654747d3e0becd139ea39e13e8608c507d8"]
    },
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
