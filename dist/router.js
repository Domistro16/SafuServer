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
const express_1 = __importDefault(require("express"));
const balance_1 = require("./packages/balance");
const firstMemecoin_1 = require("./packages/firstMemecoin");
const firstMemecoin_2 = require("./packages/firstMemecoin");
const status_1 = require("./packages/status");
const count_1 = require("./packages/count");
const pinata_1 = require("pinata");
const multer_1 = __importDefault(require("multer"));
// Removed the import of Blob from "buffer" as it conflicts with the global Blob type
require("dotenv/config");
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv/config");
const pinata = new pinata_1.PinataSDK({
    pinataJwt: `${process.env.JWT}`,
    pinataGateway: `${process.env.GATEWAY_URL}`,
});
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = express_1.default.Router();
router.use(body_parser_1.default.json());
router.get("/address/:address", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address } = req.params;
        console.log(`Searching for wallet with user ID: ${address}`); // Debugging log
        const [r, f, l, u, c] = yield Promise.all([
            (0, balance_1.calculateTotalBNBValue)(address),
            (0, firstMemecoin_1.getFirstMemecoin)(address),
            (0, firstMemecoin_2.getLastMemecoin)(address),
            (0, status_1.getUserCategory)(address),
            (0, count_1.getCount)(address),
        ]);
        res
            .status(200)
            .json({ status: r.status, first: f, last: l, user: u, count: c });
    }
    catch (err) {
        if (err instanceof Error) {
            console.error(`Error fetching wallet: ${err.message}`);
            res.status(500).json({ error: err.message });
        }
        else {
            console.error("Error fetching wallet:", err);
            res.status(500).json({ error: err });
        }
    }
}));
router.post("/nft/upload", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let url = "";
        console.log("File received:", req.file);
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }
        const blob = new globalThis.Blob([req.file.buffer], {
            type: req.file.mimetype,
        });
        const file = new File([blob], req.file.originalname, {
            type: req.file.mimetype,
        });
        const upload = yield pinata.upload.public.file(file);
        url = process.env.GATEWAY_URL + upload.cid;
        res.status(200).json({ message: "Files uploaded successfully", url: url });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
            console.log(error);
        }
    }
}));
router.post("/nft/uploadMetadata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const metadata = req.body;
        if (!metadata) {
            res.status(400).json({ error: "No metadata provided" });
            return;
        }
        const upload = yield pinata.upload.public.json(metadata);
        const url = process.env.GATEWAY_URL + upload.cid;
        res
            .status(200)
            .json({ message: "Metadata uploaded successfully", url: url });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Metadata upload error:", error);
            res.status(500).json({ error: error.message });
        }
    }
}));
exports.default = router;
