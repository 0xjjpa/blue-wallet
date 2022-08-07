import { OffersV1__factory } from '@zoralabs/v3/dist/typechain/factories/OffersV1__factory';
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/1.json";
import { providers } from 'ethers/lib/ethers';
import { getAddress } from 'ethers/lib/utils';
import { NextApiResponse, NextApiRequest } from 'next'
import { Offer } from '../../lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ offers?: Offer[], err?: string }>
) {
  const provider = String(process.env.ETH_PROVIDER);
  const { query: { address, tokenId, index } } = req;
  try {
    const collectionAddress = address instanceof Array ? address[0] : address
    const _tokenId = tokenId instanceof Array ? tokenId[0] : tokenId


    if (!collectionAddress) return res.status(501).json({ err: 'No collectionAddress provided' });
    if (!_tokenId) return res.status(501).json({ err: 'No tokenId provided' });
    if (!index) return res.status(501).json({ err: 'No index' });

    const readProvider = new providers.JsonRpcProvider(provider);
    const offerModuleContract = OffersV1__factory.connect(mainnetZoraAddresses.OffersV1, readProvider);

    try {
      let offers = [];
      if (index instanceof Array) {
        const promisedOffers = index.map(async (_index) => offerModuleContract.offers(getAddress(collectionAddress), _tokenId, _index));
        const _offers = await Promise.all(promisedOffers);
        _offers.map(offer => {
          offers.push({ maker: offer.maker, currency: offer.currency, findersFeeBps: offer.findersFeeBps, amount: offer.amount.toString() });
        })
      } else {
        const offer = await offerModuleContract.offers(getAddress(collectionAddress), _tokenId, index);
        offers.push({ maker: offer.maker, currency: offer.currency, findersFeeBps: offer.findersFeeBps, amount: offer.amount.toString() });
      }
      return res.status(200).json({ offers })
    } catch (err: any) {
      return res.status(501).json({ err })
    }

  } catch (err: any) {
    if (err.code == 'INVALID_ARGUMENT') return res.status(422).json({ err: `Invalid collection address` })
    return res.status(501).json({ err })
  }
}
