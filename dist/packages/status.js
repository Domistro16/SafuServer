"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCategory = getUserCategory;
require("dotenv/config");
const alchemy_sdk_1 = require("alchemy-sdk");
const settings = {
    apiKey: process.env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
    network: alchemy_sdk_1.Network.BNB_MAINNET, // Replace with your network.
};
const alchemy = new alchemy_sdk_1.Alchemy(settings);
function getUserCategory(walletAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const sixMonthsAgo = Date.now() - 6 * 30 * 24 * 60 * 60 * 1000;
        const twoYearsAgo = Date.now() - 2 * 365 * 24 * 60 * 60 * 1000;
        try {
            const transfers = yield alchemy.core.getAssetTransfers({
                fromAddress: walletAddress,
                category: [
                    alchemy_sdk_1.AssetTransfersCategory.ERC20,
                    alchemy_sdk_1.AssetTransfersCategory.ERC721,
                    alchemy_sdk_1.AssetTransfersCategory.EXTERNAL,
                ],
                order: alchemy_sdk_1.SortingOrder.ASCENDING, // Fetch from the first transaction
                maxCount: 1, // Get only the first transaction,
                withMetadata: true,
            });
            console.log(transfers);
            if (!transfers.transfers.length) {
                return "Unknown";
            }
            const firstTxTime = new Date(transfers.transfers[0].metadata.blockTimestamp).getTime();
            if (firstTxTime >= oneMonthAgo) {
                return "New User";
            }
            else if (firstTxTime >= sixMonthsAgo) {
                return "Regular";
            }
            else if (firstTxTime >= twoYearsAgo) {
                return "OG";
            }
            else {
                return "Veteran";
            }
        }
        catch (error) {
            console.error("Error fetching transactions:", error);
            return "Unknown";
        }
    });
}
