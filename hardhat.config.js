// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";

const HardHatConfig = {
  solidity: {
    version: "0.8.10",
    settings: {
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 100,
      },
    }
  }
}

module.exports = HardHatConfig;
