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
    bttc: {
      url: process.env.API_KEY_URL, //Your RPC URL
      accounts: [process.env.PRIVATE_KEY], //Your private key
    },
  },
  etherscan: {
    apiKey: {
      bttc: "MV94FGXHCRD7Y3WQ3R7BM8SKSXCANAYG4D",
    },
    customChains: [
      {
        network: "bttc",
        chainId: 1029,
        urls: {
          apiURL: "https://pre-rpc.bt.io/",
          browserURL: "https://testnet.bttcscan.com/",
        },
      },
    ],
  },
};
