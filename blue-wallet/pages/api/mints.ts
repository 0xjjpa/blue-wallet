import { NextApiResponse, NextApiRequest } from 'next'
import { api } from '../../lib/api'
import { API_ENDPOINT } from '../../lib/constants'
import { MINTS_QUERY } from '../../lib/query'
import { MintEvent, ZoraMintRequest } from '../../lib/types'

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<MintEvent[]>
) {
  const query = MINTS_QUERY()
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