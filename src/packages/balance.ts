import {
  Network,
  Alchemy,
  TokenBalanceType,
  TokenBalancesResponseErc20,
} from "alchemy-sdk";
import Web3 from "web3";
import "dotenv/config";
// Main function to calculate total BNB value
import { ethers, parseEther } from "ethers";
const settings = {
  apiKey: process.env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: Network.BNB_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

const WHALE_STATUS = {
  KRAKEN: { min: 100, tag: "KRAKEN" },
  WHALE: { min: 99.99, tag: "WHALE" },
  SHARK: { min: 49.99, tag: "SHARK" },
  DOLPHIN: { min: 9.99, tag: "DOLPHIN" },
  FISH: { min: 4.99, tag: "FISH" },
};
const provider = new ethers.JsonRpcProvider(
  `https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
);
const getWhaleStatus = (balance: number) => {
  if (balance < WHALE_STATUS.FISH.min || balance == Infinity) {
    return WHALE_STATUS.FISH;
  } else if (balance <= WHALE_STATUS.DOLPHIN.min) {
    return WHALE_STATUS.DOLPHIN;
  } else if (balance <= WHALE_STATUS.SHARK.min) {
    return WHALE_STATUS.SHARK;
  } else if (balance <= WHALE_STATUS.WHALE.min) {
    return WHALE_STATUS.WHALE;
  } else {
    return WHALE_STATUS.KRAKEN;
  }
};

export async function calculateTotalBNBValue(address: string) {
  const balance = await provider.getBalance(address);
  console.log(balance);
  const whaleStatus = getWhaleStatus(Number(parseEther(balance.toString())));

  return { status: whaleStatus.tag };
}
