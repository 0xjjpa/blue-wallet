export const MINTS_QUERY = `
query ListCollections {
    mints(
      pagination: {}
      sort: {sortKey: TIME, sortDirection: DESC}
      where: {}
      networks: {chain: RINKEBY}
    ) {
      nodes {
        mint {
          networkInfo {
            chain
          }
          toAddress
          collectionAddress
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