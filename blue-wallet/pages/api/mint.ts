import 'dotenv/config'
import { NextApiResponse, NextApiRequest } from 'next'
import { computeAddress, getAddress, parseEther } from 'ethers/lib/utils';
import { providers, Wallet } from 'ethers/lib/ethers';
import rinkebyZoraAddresses from "@zoralabs/v3/dist/addresses/4.json";
import { OffersV1__factory } from "@zoralabs/v3/dist/typechain/factories/OffersV1__factory";

import { MINTS_QUERY } from "../../lib/query";
import { api } from "../../lib/api";
import { ZoraMintRequest } from "../../lib/types";
import { strategy_one } from "../../lib/strategy";
import { API_ENDPOINT } from '../../lib/constants';



export default async function handler(
    _req: NextApiRequest,
    res: NextApiResponse<{ status: string }>
  ) {
  const provider = String(process.env.ETH_PROVIDER);
  const privateKey = String("0x" + process.env.PRIVATE_KEY);

  const wallet = new Wallet(privateKey, new providers.JsonRpcProvider(provider));
  const offerModuleContract = OffersV1__factory.connect(rinkebyZoraAddresses.OffersV1, wallet);

  const minter = getAddress(strategy_one.address);
  const query = MINTS_QUERY(minter && `{minterAddresses: "${minter}"}`)
  const response = await api<ZoraMintRequest>(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      operationName: 'ListCollections',
      query
    })
  })
  const mintedNFTs = response.data.mints.nodes.map( nft => ({ 
    name: nft.token.collectionName,
    minter: nft.mint.originatorAddress,
    recipient: nft.mint.toAddress,
    collectionAddress: nft.mint.collectionAddress,
    tokenId: nft.mint.tokenId
  }));

  const nft = mintedNFTs[0];
  console.log("Nft", nft)

  const findersFeeBps = "100" // 1%

  await offerModuleContract.createOffer(
    nft.collectionAddress,
    nft.tokenId,
    "0x0000000000000000000000000000000000000000",
    parseEther("0.003"),
    findersFeeBps,
    { value: parseEther("0.003") }
  )
  return res.status(200).json({ status: "ok" })
}