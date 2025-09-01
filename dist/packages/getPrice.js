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
exports.getPriceInUSD = getPriceInUSD;
require("dotenv/config");
function getPriceInUSD(tokenAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
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
            const res = yield fetch(`https://api.g.alchemy.com/prices/v1/${process.env.ALCHEMY_KEY}/tokens/by-address`, options);
            const jsonResponse = yield res.json(); // ✅ Parse response as JSON
            console.log(jsonResponse); // Log full response to debug
            // Safe access to nested values
            const priceInUSD = (_d = (_c = (_b = (_a = jsonResponse === null || jsonResponse === void 0 ? void 0 : jsonResponse.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.prices) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value;
            return priceInUSD ? Number(priceInUSD) : 0; // Ensure it returns a valid number
        }
        catch (error) {
            console.log("No price found", error);
            return 0;
        }
    });
}
