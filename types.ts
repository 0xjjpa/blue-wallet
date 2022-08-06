export type MintEvent = {
  mint: {
    networkInfo: {
      chain: "RINKEBY"
    }
    toAddress: string,
    collectionAddress: string,
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