/** @type {import('next').NextConfig} */
const path = require('path')
// const withPWA = require('next-pwa')
// const runtimeCaching = require("next-pwa/cache");
// const withTM = require('next-transpile-modules')(["three"]);


module.exports = (
  // withPWA(
  {
    reactStrictMode: true,
    // pwa: {
    //   dest: "public",
    //   register: true,
    //   skipWaiting: true,
    //   runtimeCaching,
    //   // disable: process.env.NODE_ENV === "development",
    //   buildExcludes: [/middleware-manifest.json$/]
    // },
    swcMinify: true,
    images: {
      domains: [
        'ipfs.io', "ipfs.infura.io", "ui-avatars.com", "paradise.infura-ipfs.io", "enter-the-queue.infura-ipfs.io"
      ]
    },

    env: {
      APP_BASE_URL: process.env.APP_BASE_URL,
      PRIVATE_KEY: process.env.PRIVATE_KEY,
      SECRET: process.env.SECRET,

      CONTRACT_CHAIN_NETWORK: process.env.CONTRACT_CHAIN_NETWORK,
      NFT_MARKET_PLACE_ADDRESS: process.env.NFT_MARKET_PLACE_ADDRESS,
      NFT_ADDRESS: process.env.NFT_ADDRESS,

      MONGODB_URI: process.env.MONGODB_URI,
      MONGODB_NAME: process.env.MONGODB_NAME,

      INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
      INFURA_PROJECT_SECRET: process.env.INFURA_PROJECT_SECRET,
      INFURA_API_ENDPOINT: process.env.INFURA_API_ENDPOINT,
      INFURA_IPFS_BASE_URL: process.env.INFURA_IPFS_BASE_URL,
      INFURA_RPC_ENDPOINT: process.env.INFURA_RPC_ENDPOINT,
      INFURA_KEY: process.env.INFURA_KEY,
    },
    trailingSlash: true,
    experimental: {
      esmExternals: true,
    },
    webpack: config => {
      config.resolve.alias = {
        ...config.resolve.alias,
        apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
      }

      return config
    }
  }
  // )
);
