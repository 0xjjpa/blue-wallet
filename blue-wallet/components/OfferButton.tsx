import { Button } from "@chakra-ui/react";
import mainnetZoraAddresses from "@zoralabs/v3/dist/addresses/1.json";
import offersV1 from "@zoralabs/v3/dist/artifacts/OffersV1.sol/OffersV1.json";
import { parseEther } from "ethers/lib/utils";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { MintEvent } from "../lib/types";

export const OfferButton = ({ mint }: { mint: MintEvent }) => {
  const { isConnected } = useAccount();
  const getArgs = (collectionAddress: string, tokenId: string) => [
    collectionAddress,
    tokenId,
    "0x0000000000000000000000000000000000000000",
    parseEther("0.001").toString(),
    "100",
  ];
  const overrides = { value: parseEther("0.001") };
  const contractConfig = {
    addressOrName: mainnetZoraAddresses.OffersV1,
    contractInterface: offersV1.abi,
  };
  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "createOffer",
    args: getArgs(mint.mint.collectionAddress, mint.mint.tokenId),
    overrides,
  });
  const {
    data: offerData,
    write: offer,
    isLoading: isOfferLoading,
    isSuccess: ihasOfferStarted,
    error: offerError,
  } = useContractWrite(contractWriteConfig);
  return (
    <Button disabled={!isConnected} onClick={() => offer?.()}>
      Offer
    </Button>
  );
};
