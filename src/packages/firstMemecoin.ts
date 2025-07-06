import "dotenv/config";
import {
  Alchemy,
  AssetTransfersCategory,
  Network,
  SortingOrder,
} from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
  network: Network.BNB_MAINNET, // Replace with your network.
};
const alchemy = new Alchemy(settings);

export async function getFirstMemecoin(address: string) {
  try {
    const response = await alchemy.core.getAssetTransfers({
      toAddress: address,
      category: [AssetTransfersCategory.ERC20],
    });

    const firstMemecoin = response.transfers[0].rawContract.address;

    const metadata = await alchemy.core.getTokenMetadata(
      firstMemecoin as string
    );

    const name = metadata.name;
    return name;
  } catch (error) {
    return "null";
  }
}

export async function getLastMemecoin(address: string) {
  try {
    const response = await alchemy.core.getAssetTransfers({
      toAddress: address,
      category: [AssetTransfersCategory.ERC20],
      order: SortingOrder.DESCENDING,
    });

    const lastMemecoin = response.transfers[0].rawContract.address;

    const metadata = await alchemy.core.getTokenMetadata(
      lastMemecoin as string
    );

    const name = metadata.name;
    return name;
  } catch (error) {
    return "null";
  }
}
