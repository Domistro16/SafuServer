import "dotenv/config";
// Replace with your Alchemy API Ke
const baseURL = `https://bnb-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`;

export async function getMemecoiner(address: string) {
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
          excludeZeroValue: false,
          toAddress: "0x5c952063c7fc8610FFDB798152D69F0B9550762b",
        },
      ],
    };

    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.result.transfers > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}
