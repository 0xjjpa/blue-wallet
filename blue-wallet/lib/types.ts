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
      blockTimestamp: string
    }
    price: {
      nativePrice: {
        currency: {
          address: string
          name: string
        }
        decimal: BigNumber
      }
    }
  }
  token: {
    collectionName: string
    image: {
      mediaEncoding: {
        thumbnail: string
      }
    }
  }

}
export type ZoraMintRequest = {
  data: {
    mints: {
      nodes: MintEvent[]
    }
  }

}