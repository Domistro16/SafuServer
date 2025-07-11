import "dotenv/config";
export const getCount = async (address: string) => {
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

    const response = await fetch(
      `https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`,
      options
    );
    const formatted = await response.json();

    const count = parseInt(formatted.result, 16);
    return count;
  } catch (error) {
    return 0;
  }
};
