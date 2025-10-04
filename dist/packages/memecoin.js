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
exports.getMemecoiner = getMemecoiner;
// Replace with your Alchemy API Key
const apiKey = "docs-demo";
const baseURL = `https://bnb-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`;
function getMemecoiner(address) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = {
                jsonrpc: "2.0",
                id: 0,
                method: "alchemy_getAssetTransfers",
                params: [
                    {
                        fromBlock: "0x0",
                        fromAddress: address,
                        category: ["external", "erc20", "erc721", "erc1155"],
                        toAddress: "0x5c952063c7fc8610FFDB798152D69F0B9550762b",
                    },
                ],
            };
            const response = yield fetch(baseURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = yield response.json();
            if (result.result.transfers > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            console.error("Error:", error);
            return false;
        }
    });
}
