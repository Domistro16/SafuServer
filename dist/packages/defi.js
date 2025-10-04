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
exports.getDefiDegen = getDefiDegen;
const PANCAKE_V3_SUBGRAPH = "https://gateway.thegraph.com/api/subgraphs/id/Hv1GncLY5docZoGtXjo4kwbTvxm3MAhVZqBZE4sUT9eZ";
const PANCAKE_V2_SUBGRAPH = "https://gateway.thegraph.com/api/subgraphs/id/C5EuiZwWkCge7edveeMcvDmdr7jjc1zG4vgn8uucLdfz";
function graphqlFetch(endpoint, query, variables) {
    return __awaiter(this, void 0, void 0, function* () {
        const resp = yield fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GRAPH_API_KEY} `,
            },
            body: JSON.stringify({ query, variables }),
        });
        const j = yield resp.json();
        if (j.errors) {
            console.error("GraphQL errors:", j.errors);
            throw new Error("GraphQL query failed");
        }
        return j.data;
    });
}
function getDefiDegen(address) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const data1 = yield graphqlFetch(PANCAKE_V3_SUBGRAPH, q1, { wallet: address });
        if (data1.swaps.length > 0) {
            isDefi = true;
        }
        if (!isDefi) {
            const data2 = yield graphqlFetch(PANCAKE_V2_SUBGRAPH, q2, { wallet: address });
            if (data2.swaps.length > 0) {
                isDefi = true;
            }
        }
        return isDefi;
    });
}
