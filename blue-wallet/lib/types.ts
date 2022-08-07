import { BigNumber } from "ethers/lib/ethers";

export type Offer = {
  maker: string;
  currency: string;
  findersFeeBps: number;
  amount: string;
}

export type MintEvent = {
  mint: {
    networkInfo: {
      chain: "MAINNET"
    }
    toAddress: string,
    collectionAddress: string,
    originatorAddress: string,
    tokenId: string,
    transactionInfo: {
      transactionHash: string
    }
  }
  token: {
    collectionName: string
  }

}
export type ZoraMintRequest = {
  data: {
    mints: {
      nodes: MintEvent[]
    }
  }

}