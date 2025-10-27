import "dotenv/config";
import {
  Alchemy,
  AssetTransfersCategory,
  Network,
  SortingOrder,
} from "alchemy-sdk";
import { ethers } from "ethers";

const ALCHEMY_KEY = process.env.ALCHEMY_KEY;
if (!ALCHEMY_KEY) {
  throw new Error("Missing ALCHEMY_KEY in environment");
}

const settings = {
  apiKey: ALCHEMY_KEY,
  network: Network.BNB_MAINNET, // keep if you're targeting BNB mainnet via Alchemy
};

const alchemy = new Alchemy(settings);
const provider = new ethers.JsonRpcProvider(
  `https://bnb-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`
);

function hexOrNumberToInt(value: string | number | undefined) {
  if (value == null) return undefined;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    // if starts with 0x treat as hex, else parse decimal
    return value.startsWith("0x") ? parseInt(value, 16) : parseInt(value, 10);
  }
  return undefined;
}

/**
 * Determine user category based on first on-chain activity time.
 * Returns one of: "Newbie", "Regular", "Experienced", "OG", "Unknown"
 */
export async function getUserCategory(walletAddress: string) {
  // thresholds in milliseconds
  const now = Date.now();
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
  const sixMonthsAgo = now - 6 * 30 * 24 * 60 * 60 * 1000;
  const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000;

  try {
    // Query both outgoing and incoming transfers, get earliest
    const [outgoing, incoming] = await Promise.all([
      alchemy.core.getAssetTransfers({
        fromAddress: walletAddress,
        category: [
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.ERC1155,
        ],
        order: SortingOrder.ASCENDING,
        maxCount: 1,
      }),
      alchemy.core.getAssetTransfers({
        toAddress: walletAddress,
        category: [
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.ERC1155,
        ],
        order: SortingOrder.ASCENDING,
        maxCount: 1,
      }),
    ]);

    const firstOutgoing = outgoing?.transfers?.[0];
    const firstIncoming = incoming?.transfers?.[0];

    if (!firstOutgoing && !firstIncoming) {
      return "Unknown";
    }

    // pick the earliest (by blockNum if available)
    let candidate = firstOutgoing ?? firstIncoming;
    if (firstOutgoing && firstIncoming) {
      const outBlock = hexOrNumberToInt(firstOutgoing.blockNum);
      const inBlock = hexOrNumberToInt(firstIncoming.blockNum);
      if (
        typeof outBlock === "number" &&
        typeof inBlock === "number" &&
        inBlock < outBlock
      ) {
        candidate = firstIncoming;
      } else if (typeof outBlock !== "number" && typeof inBlock === "number") {
        candidate = firstIncoming;
      }
    }

    // resolve block number safely
    const blockNum = hexOrNumberToInt(candidate.blockNum);
    if (blockNum == null) {
      // fallback: try to get the tx and use its timestamp (if available) or return Unknown
      if (candidate.hash) {
        const tx = await provider.getTransaction(candidate.hash);
        if (tx?.blockNumber) {
          const block = await provider.getBlock(tx.blockNumber);
          if (block?.timestamp) {
            const firstTxTime = block.timestamp * 1000;
            // classification below
            if (firstTxTime >= oneMonthAgo) return "Newbie";
            if (firstTxTime >= sixMonthsAgo) return "Regular";
            if (firstTxTime >= twoYearsAgo) return "Experienced";
            return "OG";
          }
        }
      }
      return "Unknown";
    }

    const block = await provider.getBlock(blockNum);
    if (!block || typeof block.timestamp !== "number") {
      return "Unknown";
    }

    const firstTxTime = block.timestamp * 1000; // seconds -> ms

    // classification (example mapping)
    if (firstTxTime >= oneMonthAgo) {
      return "Newbie"; // joined within last month
    } else if (firstTxTime >= sixMonthsAgo) {
      return "Regular"; // 1 month - 6 months
    } else if (firstTxTime >= twoYearsAgo) {
      return "OG"; // 6 months - 2 years
    } else {
      return "Veteran"; // > 2 years
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return "Unknown";
  }
}
