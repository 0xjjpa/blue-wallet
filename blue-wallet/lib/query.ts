export const MINTS_QUERY = (minterAddresses = "{}") => `
query ListCollections {
    mints(
      pagination: {}
      sort: {sortKey: TIME, sortDirection: DESC}
      where: ${minterAddresses}
      networks: {chain: MAINNET}
    ) {
      nodes {
        mint {
          networkInfo {
            chain
          }
          toAddress
          collectionAddress
          originatorAddress
          tokenId
          transactionInfo {
            transactionHash
          }
        }
        token {
          collectionName
        }
      }
    }
  }
`