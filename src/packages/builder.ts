// Replace with your Alchemy API Key
import "dotenv/config";
const apiKey = process.env.ALCHEMY_KEY || "demo";
const baseURL = `https://bnb-mainnet.g.alchemy.com/v2/${apiKey}`;

// Define the asynchronous function that will retrieve deployed contracts
export async function findContractsDeployed(
  address: string
): Promise<string[]> {
  const transfers: any[] = [];
  let pageKey: string | undefined = undefined;

  // Paginate through the results using alchemy_getAssetTransfers method
  do {
    const requestBody: any = {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          toBlock: "latest", // Fetch results up to the latest block
          fromAddress: address, // Filter results to only include transfers from the specified address
          excludeZeroValue: false, // Include transfers with a value of 0
          category: ["external"], // Filter results to only include external transfers
          ...(pageKey && { pageKey }), // Add pageKey if it exists
        },
      ],
    };

    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Alchemy request failed: ${response.status} ${text}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Alchemy error: ${JSON.stringify(data.error)}`);
    }

    const resultTransfers = Array.isArray(data.result?.transfers)
      ? data.result.transfers
      : [];

    transfers.push(...resultTransfers);
    pageKey = data.result?.pageKey;
  } while (pageKey);

  // Filter the transfers to only include contract deployments (where 'to' is null)
  const deployments = transfers.filter(
    (transfer) => transfer.to === null || transfer.to === undefined
  );

  return deployments;
}

// Define the main function that will execute the script
export async function isBuilder(address: string): Promise<boolean> {
  try {
    // Call the findContractsDeployed function to retrieve the array of deployed contracts
    const deployments = await findContractsDeployed(address);
    return deployments.length > 0;
  } catch (error) {
    console.error("Error in isBuilder:", error);
    return false;
  }
}
