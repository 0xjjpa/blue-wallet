import { OffersV1__factory } from '@zoralabs/v3/dist/typechain/factories/OffersV1__factory';
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/1.json";
import { providers } from 'ethers/lib/ethers';
import { getAddress } from 'ethers/lib/utils';
import { NextApiResponse, NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ offers?: number[], err?: string }>
) {
  const provider = String(process.env.ETH_PROVIDER);
  const { query: { address, tokenId } } = req;
  try {
    const collectionAddress = address instanceof Array ? address[0] : address
    const _tokenId = tokenId instanceof Array ? tokenId[0] : tokenId
    if (!collectionAddress) return res.status(501).json({ err: 'No collectionAddress provided' });
    if (!_tokenId) return res.status(501).json({ err: 'No tokenId provided' });

    const readProvider = new providers.JsonRpcProvider(provider);
    const offerModuleContract = OffersV1__factory.connect(mainnetZoraAddresses.OffersV1, readProvider);

    let hasValidOffers = true;
    const offers = []
    let index = 0
    while (hasValidOffers) {
      try {
        const offer = await offerModuleContract.offersForNFT(getAddress(collectionAddress), _tokenId, index);
        offers.push(offer.toNumber())
        index++;
      } catch (err: any) {
        if (err.code == 'CALL_EXCEPTION') {
          hasValidOffers = false;
        }
      }
    }
    return res.status(200).json({ offers })
  } catch (err: any) {
    if (err.code == 'INVALID_ARGUMENT') return res.status(422).json({ err: `Invalid collection address` })
    return res.status(501).json({ err })
  }
}
