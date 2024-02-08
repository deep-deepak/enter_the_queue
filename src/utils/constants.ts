
import nftMarketPlace from '../../artifacts/contracts/NFTMarket.sol/NFTMarketplace.json'
import nft from '../../artifacts/contracts/NFT.sol/NFT.json'
import networks from '../data/evm-network-chains.json';
import variables from '../../variables.json';

import type { DvNetwork, Environments } from '../../@types';

const envVariables: any = Object.keys(process.env).length ? process.env : variables;


//  NFT Contract Details
export const NFT_ADDRESS = envVariables.NFT_ADDRESS || "";
export const NFT_ABI = nft.abi || [];
export const NFT_BYTECODE = nft.bytecode || "";

// NFT Marketplace Contract Details
export const NFT_MARKET_PLACE_ADDRESS = envVariables.NFT_MARKET_PLACE_ADDRESS || "";
export const NFT_MARKET_PLACE_ABI = nftMarketPlace.abi || [];
export const NFT_MARKET_PLACE_BYTECODE = nftMarketPlace.bytecode || "";

export const MORALIS_IPFS_BASE_URL = envVariables.MORALIS_IPFS_BASE_URL || "";

export const SITE_COLORS = () => {
    var siteColors = envVariables.SITE_COLORS || "";
    const newSiteColors: string[] = siteColors.split(",").filter(c => c);
    return newSiteColors.length ? newSiteColors : ["#000000", "#250a18", "#3e0932", "#510b55", "#571a81"];
};

export const NETWORK_CHAIN = envVariables.CONTRACT_CHAIN_NETWORK || "goerli";
export const CURRENT_NETWORK: DvNetwork = networks?.find(network => network.id == NETWORK_CHAIN) || {};
export const ETHERSCAN_BASE_URL = CURRENT_NETWORK?.scan_url || "";
export const SITE_TOKEN = CURRENT_NETWORK.token || "ETH";


// Pinata IPFS Details 
export const PINATA_BASE_URL = envVariables.PINATA_BASE_URL || "";
export const PINATA_API_KEY = envVariables.PINATA_API_KEY || "";

export const PRIVATE_KEY = envVariables.PRIVATE_KEY || "";

// Infura Details
export const INFURA_PROJECT_ID = envVariables.INFURA_PROJECT_ID || "";
export const INFURA_PROJECT_SECRET = envVariables.INFURA_PROJECT_SECRET || "";
export const INFURA_API_ENDPOINT = envVariables.INFURA_API_ENDPOINT || "https://ipfs.infura.io:5001";
export const INFURA_IPFS_BASE_URL = envVariables.INFURA_IPFS_BASE_URL || "https://ipfs.io/ipfs/";
export const INFURA_KEY = envVariables.INFURA_KEY || "f9a50f205dd4475bbf1da2a0d21f7c36"
export const INFURA_RPC_ENDPOINT = envVariables.INFURA_RPC_ENDPOINT || `https://${NETWORK_CHAIN}.infura.io/v3/${INFURA_KEY}`;


// Site Details
export const SECRET = envVariables.SECRET || "enter-the-queue-crsf-token";
export const APP_BASE_URL = envVariables.APP_BASE_URL || "";
export const LIVE_APP_BASE_URL = envVariables.LIVE_APP_BASE_URL || "https://enterthequeue.com/";
export const ARTIST_REGISTRATION_SECRET = "enter-the-queue-artist-token"