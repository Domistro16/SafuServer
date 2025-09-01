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
exports.getFirstMemecoin = getFirstMemecoin;
exports.getLastMemecoin = getLastMemecoin;
require("dotenv/config");
const alchemy_sdk_1 = require("alchemy-sdk");
const settings = {
    apiKey: process.env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
    network: alchemy_sdk_1.Network.BNB_MAINNET, // Replace with your network.
};
const alchemy = new alchemy_sdk_1.Alchemy(settings);
function getFirstMemecoin(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield alchemy.core.getAssetTransfers({
                toAddress: address,
                category: [alchemy_sdk_1.AssetTransfersCategory.ERC20],
            });
            const firstMemecoin = response.transfers[0].rawContract.address;
            const metadata = yield alchemy.core.getTokenMetadata(firstMemecoin);
            const name = metadata.name;
            return name;
        }
        catch (error) {
            return "null";
        }
    });
}
function getLastMemecoin(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield alchemy.core.getAssetTransfers({
                toAddress: address,
                category: [alchemy_sdk_1.AssetTransfersCategory.ERC20],
                order: alchemy_sdk_1.SortingOrder.DESCENDING,
            });
            const lastMemecoin = response.transfers[0].rawContract.address;
            const metadata = yield alchemy.core.getTokenMetadata(lastMemecoin);
            const name = metadata.name;
            return name;
        }
        catch (error) {
            return "null";
        }
    });
}
