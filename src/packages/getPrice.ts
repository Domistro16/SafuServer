import "dotenv/config";
import {
  Alchemy,
  AssetTransfersCategory,
  Network,
  SortingOrder,
} from "alchemy-sdk";
import { ethers } from "ethers";
const settings = {
  apiKey: process.env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: Network.BNB_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

export async function getPriceInUSD(tokenAddress: string) {
  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        addresses: [{ network: "bnb-mainnet", address: tokenAddress }],
      }),
    };

    const res = await fetch(
      `https://bnb-mainnet.g.alchemy.com/prices/v1/${process.env.ALCHEMY_KEY}/tokens/by-address`,
      options
    );
    const jsonResponse = await res.json(); // ✅ Parse response as JSON

    console.log(jsonResponse); // Log full response to debug

    // Safe access to nested values
    const priceInUSD = jsonResponse?.data?.[0]?.prices?.[0]?.value;

    return priceInUSD ? Number(priceInUSD) : 0; // Ensure it returns a valid number
  } catch (error) {
    console.log("No price found", error);
    return 0;
  }
}
