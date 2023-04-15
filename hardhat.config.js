require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config({ path: __dirname + "/.env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "./src/artifacts",
  },
  networks: {
    customChains: [
      {
        network: "bttc",
        chainId: 1029,
        urls: {
          apiURL: "https://bttcscan.com",
          browserURL: "https://testnet.bttcscan.com/",
        },
      },
    ],
    bttc: {
      url: process.env.API_KEY_URL, //Your RPC URL
      accounts: [process.env.PRIVATE_KEY], //Your private key
    },
  },
  etherscan: {
    apiKey: process.env.BTTCSCAN_API_KEY,
  },
};
