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
exports.getCount = void 0;
require("dotenv/config");
const getCount = (address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const options = {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                id: 1,
                jsonrpc: "2.0",
                params: [address, "latest"],
                method: "eth_getTransactionCount",
            }),
        };
        const response = yield fetch(`https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`, options);
        const formatted = yield response.json();
        const count = parseInt(formatted.result, 16);
        return count;
    }
    catch (error) {
        return 0;
    }
});
exports.getCount = getCount;
