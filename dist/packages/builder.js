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
exports.findContractsDeployed = findContractsDeployed;
exports.isBuilder = isBuilder;
// Replace with your Alchemy API Key
const apiKey = process.env.ALCHEMY_API_KEY || "demo";
const baseURL = `https://bnb-mainnet.g.alchemy.com/v2/${apiKey}`;
// Define the asynchronous function that will retrieve deployed contracts
function findContractsDeployed(address) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const transfers = [];
        let pageKey = undefined;
        // Paginate through the results using alchemy_getAssetTransfers method
        do {
            const requestBody = {
                jsonrpc: "2.0",
                id: 1,
                method: "alchemy_getAssetTransfers",
                params: [
                    Object.assign({ fromBlock: "0x0", toBlock: "latest", fromAddress: address, excludeZeroValue: false, category: ["external"] }, (pageKey && { pageKey })),
                ],
            };
            const response = yield fetch(baseURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                const text = yield response.text();
                throw new Error(`Alchemy request failed: ${response.status} ${text}`);
            }
            const data = yield response.json();
            if (data.error) {
                throw new Error(`Alchemy error: ${JSON.stringify(data.error)}`);
            }
            const resultTransfers = Array.isArray((_a = data.result) === null || _a === void 0 ? void 0 : _a.transfers)
                ? data.result.transfers
                : [];
            transfers.push(...resultTransfers);
            pageKey = (_b = data.result) === null || _b === void 0 ? void 0 : _b.pageKey;
        } while (pageKey);
        // Filter the transfers to only include contract deployments (where 'to' is null)
        const deployments = transfers.filter((transfer) => transfer.to === null || transfer.to === undefined);
        const txHashes = deployments
            .map((deployment) => deployment.hash)
            .filter(Boolean);
        if (txHashes.length === 0)
            return [];
        // Fetch the transaction receipts for each of the deployment transactions
        const promises = txHashes.map((hash) => __awaiter(this, void 0, void 0, function* () {
            const requestBody = {
                jsonrpc: "2.0",
                id: 1,
                method: "eth_getTransactionReceipt",
                params: [hash],
            };
            const response = yield fetch(baseURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (!response.ok) {
                const text = yield response.text();
                throw new Error(`Failed to fetch receipt for ${hash}: ${response.status} ${text}`);
            }
            const data = yield response.json();
            return data.result;
        }));
        // Wait for all the transaction receipts to be fetched
        const receipts = yield Promise.all(promises);
        const contractAddresses = receipts
            .map((receipt) => receipt === null || receipt === void 0 ? void 0 : receipt.contractAddress)
            .filter(Boolean);
        return contractAddresses;
    });
}
// Define the main function that will execute the script
function isBuilder(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Call the findContractsDeployed function to retrieve the array of deployed contracts
            const contractAddresses = yield findContractsDeployed(address);
            return contractAddresses.length > 0;
        }
        catch (error) {
            console.error("Error in isBuilder:", error);
            return false;
        }
    });
}
