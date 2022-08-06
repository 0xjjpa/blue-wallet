import { API_ENDPOINT } from "./constants"
import { MINTS_QUERY } from "./query";
import { api } from "./api";
import { ZoraMintRequest } from "./types";

async function main() {
  const response = await api<ZoraMintRequest>(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ operationName: 'ListCollections', query: MINTS_QUERY })
  })
  const mintedNFTs = response.data.mints.nodes.map( nft => nft.token.collectionName );
  console.log("MintedNFTs", mintedNFTs)
}

main()