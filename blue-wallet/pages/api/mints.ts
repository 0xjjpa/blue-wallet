import { NextApiResponse, NextApiRequest } from 'next'
import { api } from '../../lib/api'
import { API_ENDPOINT } from '../../lib/constants'
import { MINTS_QUERY } from '../../lib/query'
import { MintEvent, ZoraMintRequest } from '../../lib/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MintEvent[]>
) {
  const { query: { address, tokenId } } = req;
  const query = MINTS_QUERY(address ? address && tokenId ? `{tokens: {address: "${address}", tokenId: "${tokenId}"}}` : `{collectionAddresses: "${address}"}` : '{}')
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
  return res.status(200).json(response.data.mints.nodes)
}