import { wallet } from '@rainbow-me/rainbowkit';
import { OffersV1__factory } from '@zoralabs/v3/dist/typechain/factories/OffersV1__factory';
import rinkebyZoraAddresses from "@zoralabs/v3/dist/addresses/4.json";
import { providers } from 'ethers/lib/ethers';
import { getAddress } from 'ethers/lib/utils';
import { NextApiResponse, NextApiRequest } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{}>
) {
  const provider = String(process.env.ETH_PROVIDER);
  const { body: { collectionAddress, tokenId } } = req;
  try {
    if (!collectionAddress) return res.status(501).json({ err: 'No collectionAddress provided' });
    if (!tokenId) return res.status(501).json({ err: 'No tokenId provided' });

    const readProvider = new providers.JsonRpcProvider(provider);
    const offerModuleContract = OffersV1__factory.connect(rinkebyZoraAddresses.OffersV1, readProvider);

    const offers = await offerModuleContract.offersForNFT(getAddress(collectionAddress), tokenId, 0);

    return res.status(200).json({ offers })
  } catch (err: any) {
    if (err.code == 'INVALID_ARGUMENT') return res.status(422).json({ err: `Invalid collection address` })
  }
}
