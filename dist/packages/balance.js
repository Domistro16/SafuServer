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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalBNBValue = calculateTotalBNBValue;
const alchemy_sdk_1 = require("alchemy-sdk");
const web3_1 = __importDefault(require("web3"));
require("dotenv/config");
// Main function to calculate total BNB value
const web3 = new web3_1.default("https://bsc-dataseed.binance.org/");
const settings = {
    apiKey: process.env.ALCHEMY_KEY, // Replace with your Alchemy API Key.
    network: alchemy_sdk_1.Network.BNB_MAINNET, // Replace with your network.
};
const alchemy = new alchemy_sdk_1.Alchemy(settings);
const WHALE_STATUS = {
    KRAKEN: { min: 15, tag: "KRAKEN" },
    WHALE: { min: 14, tag: "WHALE" },
    SHARK: { min: 10, tag: "SHARK" },
    DOLPHIN: { min: 5, tag: "DOLPHIN" },
    FISH: { min: 0.1, tag: "FISH" },
};
const tokenAbi = [
    {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: "from", type: "address" },
            { indexed: true, name: "to", type: "address" },
            { indexed: false, name: "value", type: "uint256" },
        ],
        name: "Transfer",
        type: "event",
    },
];
const getWhaleStatus = (balance) => {
    if (balance < WHALE_STATUS.FISH.min || balance == Infinity) {
        return WHALE_STATUS.FISH;
    }
    else if (balance <= WHALE_STATUS.DOLPHIN.min) {
        return WHALE_STATUS.DOLPHIN;
    }
    else if (balance <= WHALE_STATUS.SHARK.min) {
        return WHALE_STATUS.SHARK;
    }
    else if (balance <= WHALE_STATUS.WHALE.min) {
        return WHALE_STATUS.WHALE;
    }
    else {
        return WHALE_STATUS.KRAKEN;
    }
};
function calculateTotalBNBValue(address) {
    return __awaiter(this, void 0, void 0, function* () {
        let pageKey = undefined;
        let allBalances = [];
        do {
            const response = yield alchemy.core.getTokenBalances(address, {
                type: alchemy_sdk_1.TokenBalanceType.ERC20,
                pageKey: pageKey,
            });
            allBalances = allBalances.concat(response.tokenBalances);
            pageKey = response.pageKey;
        } while (pageKey);
        let values = [];
        let i = 1;
        const nonZeroBalances = allBalances.filter((token) => {
            return token.tokenBalance !== "0";
        });
        let whale = [];
        if (nonZeroBalances.length == 0) {
            return { status: "FISH" };
        }
        for (const token of nonZeroBalances) {
            const tokenContract = new web3.eth.Contract(tokenAbi, token.contractAddress);
            let balance = token.tokenBalance;
            // Get metadata of token
            const metadata = yield alchemy.core.getTokenMetadata(token.contractAddress);
            // Compute token balance in human-readable format
            balance = Number(balance) / Math.pow(10, metadata.decimals);
            balance = parseFloat(balance.toFixed(2));
            // Print name, balance, and symbol of token
            let supply;
            try {
                supply = yield tokenContract.methods.totalSupply().call();
            }
            catch (error) {
                console.error("Error fetching total supply:", error);
                supply = 1000000000000;
            }
            const percerntage = (balance / Number(supply)) * 100;
            const whaleStatus = getWhaleStatus(percerntage);
            whale.push(whaleStatus.tag);
            values.push({
                name: metadata.name,
                balance: balance,
                symbol: metadata.symbol,
            });
            console.log(`${i++}. ${metadata.name}: ${balance} ${metadata.symbol}`);
        }
        let status = "";
        if (whale) {
            if (whale.find((element) => element === "KRAKEN")) {
                status = "KRAKEN";
            }
            else if (whale.find((element) => element === "WHALE")) {
                status = "WHALE";
            }
            else if (whale.find((element) => element === "SHARK")) {
                status = "SHARK";
            }
            else if (whale.find((element) => element === "DOLPHIN")) {
                status = "DOLPHIN";
            }
            else {
                status = "FISH";
            }
        }
        return { status: status };
    });
}
