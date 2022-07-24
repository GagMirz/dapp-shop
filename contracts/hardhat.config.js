require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.9",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000000,
    },
  },
  mocha: {
    timeout: 90000
  },
  networks: {
    eth_testnet: {
        url: `https://rinkeby.infura.io/v3/50a68863113243e6949e0d614d1a2854`,
        accounts: ["0xaf824b2aa26bd2a08dae3baab726815a15d7dc309fae3b83f6ac3fde2282838f"],
    },
    eth_mainnet: {
      url: `https://eth_mainnet.infura.io/v3/50a68863113243e6949e0d614d1a2854`,
      accounts: ["0xaf824b2aa26bd2a08dae3baab726815a15d7dc309fae3b83f6ac3fde2282838f"],
    }
}
};
