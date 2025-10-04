import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const PANCAKE_V3_SUBGRAPH =
  "https://gateway.thegraph.com/api/subgraphs/id/Hv1GncLY5docZoGtXjo4kwbTvxm3MAhVZqBZE4sUT9eZ";

const PANCAKE_V2_SUBGRAPH =
  "https://gateway.thegraph.com/api/subgraphs/id/C5EuiZwWkCge7edveeMcvDmdr7jjc1zG4vgn8uucLdfz";


async function graphqlFetch<T>(
  endpoint: string,
  query: string,
  variables: any
): Promise<T> {
  const resp = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GRAPH_API_KEY} `,
    },
    body: JSON.stringify({ query, variables }),
  });
  const j = await resp.json();
  if (j.errors) {
    console.error("GraphQL errors:", j.errors);
    throw new Error("GraphQL query failed");
  }
  return j.data;
}

export async function getDefiDegen(address: string) {
   const q1 = `
    query HasTxn($wallet: String!) {
        swaps (
    where: { sender: $wallet } 
    first: 1
  ) {
    id
    timestamp
    transaction {
      id
    }
    sender
  }

      }
    `;
  const q2 = `
      query HasTxn($wallet: String!) {
        swaps (
    where: { sender: $wallet } 
    first: 1
  ) {
    id
    timestamp
    transaction {
      id
    }
    sender
  }

      }
    `;

  let isDefi = false;
  const data1 = await graphqlFetch<{ swaps: { id: string }[] }>(
    PANCAKE_V3_SUBGRAPH,
    q1,
    { wallet: address }
  );

  if (data1.swaps.length > 0) {
    isDefi = true;
  }

  if (!isDefi) {
    const data2 = await graphqlFetch<{ swaps: { id: string }[] }>(
      PANCAKE_V2_SUBGRAPH,
      q2,
      { wallet: address }
    );
    if (data2.swaps.length > 0) {
      isDefi = true;
    }
  }
  return isDefi;
}

