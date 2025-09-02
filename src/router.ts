import express from "express";
import { calculateTotalBNBValue } from "./packages/balance";
import { getFirstMemecoin } from "./packages/firstMemecoin";
import { getLastMemecoin } from "./packages/firstMemecoin";
import { getUserCategory } from "./packages/status";
import { getCount } from "./packages/count";
import { PinataSDK } from "pinata";
import multer from "multer";
import { File, Blob } from "node:buffer";
// Removed the import of Blob from "buffer" as it conflicts with the global Blob type
import "dotenv/config";
import bodyParser from "body-parser";
import "dotenv/config";

const pinata = new PinataSDK({
  pinataJwt: `${process.env.JWT}`,
  pinataGateway: `${process.env.GATEWAY_URL}`,
});

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();
router.use(bodyParser.json());

router.get("/address/:address", async (req, res) => {
  try {
    const { address } = req.params;
    console.log(`Searching for wallet with user ID: ${address}`); // Debugging log

    const [r, f, l, u, c] = await Promise.all([
      calculateTotalBNBValue(address),
      getFirstMemecoin(address),
      getLastMemecoin(address),
      getUserCategory(address),
      getCount(address),
    ]);

    res
      .status(200)
      .json({ status: r.status, first: f, last: l, user: u, count: c });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error fetching wallet: ${err.message}`);
      res.status(500).json({ error: err.message });
    } else {
      console.error("Error fetching wallet:", err);
      res.status(500).json({ error: err });
    }
  }
});

router.post("/nft/upload", upload.single("file"), async (req, res) => {
  try {
    let url = "";
    console.log("File received:", req.file);
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const blob = new Blob([req.file.buffer], {
      type: req.file.mimetype,
    });
    const file = new File([blob], req.file.originalname, {
      type: req.file.mimetype,
    });
    console.log("File created:", file);
    const upload = await pinata.upload.public.file(file as unknown as globalThis.File);
    console.log(upload)
    url = `https://ipfs.io/ipfs/` + upload.cid;
    res.status(200).json({ message: "Files uploaded successfully", url: url });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      console.log(error);
    }
  }
});

router.post("/nft/uploadMetadata", async (req, res) => {
  try {
    const metadata = req.body;
    if (!metadata) {
      res.status(400).json({ error: "No metadata provided" });
      return;
    }
    console.log("Metadata received:", metadata);
    const upload = await pinata.upload.public.json(metadata);
    console.log(upload)
    const url = `https://ipfs.io/ipfs/` + upload.cid;
    res
      .status(200)
      .json({ message: "Metadata uploaded successfully", url: url });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Metadata upload error:", error);
      res.status(500).json({ error: error.message });
    }
  }
});

export default router;
