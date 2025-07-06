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

export async function getUserCategory(walletAddress: string) {
  const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
  const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000;

  try {
    const transfers = await alchemy.core.getAssetTransfers({
      fromAddress: walletAddress,
      category: [
        AssetTransfersCategory.ERC20,
        AssetTransfersCategory.ERC721,
        AssetTransfersCategory.EXTERNAL,
      ],
      order: SortingOrder.ASCENDING, // Fetch from the first transaction
      maxCount: 1, // Get only the first transaction,
      withMetadata: true,
    });

    console.log(transfers);

    if (!transfers.transfers.length) {
      return "Unknown";
    }

    const firstTxTime = new Date(
      transfers.transfers[0].metadata.blockTimestamp
    ).getTime();

    if (firstTxTime >= oneMonthAgo) {
      return "New User";
    } else if (firstTxTime >= sixMonthsAgo) {
      return "Regular";
    } else if (firstTxTime >= twoYearsAgo) {
      return "OG";
    } else {
      return "Veteran";
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return "Unknown";
  }
}
