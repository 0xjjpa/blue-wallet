import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { getAddress } from "ethers/lib/utils";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { genKey, shorten } from "../lib/helpers";
import { MintEvent } from "../lib/types";
import { Address } from "./atoms/Address";
import { Transaction } from "./atoms/Transaction";
import { OfferTable } from "./OfferTable";

export const MintTable = () => {
  const TIMEOUT_MAX_DELAY_MS = 1000;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isLoadingTokenId, setLoadingTokenId] = useState<boolean>(false);
  const [mints, setMints] = useState<MintEvent[]>([]);
  const [maybeCollectionAddress, setMaybeCollectionAddress] =
    useState<string>("");
  const [currentCollectionAddress, setCurrentCollectionAddress] =
    useState<string>("");
  const [maybeTokenId, setMaybeTokenId] = useState<string>();
  const [currentTokenId, setCurrentTokenId] = useState<string>();

  const updateCurrentCollectionAddress = () => {
    try {
      const validAddress = getAddress(maybeCollectionAddress);
      setCurrentCollectionAddress(validAddress);
    } catch (err: any) {
      setCurrentCollectionAddress("");
    }
  };

  const updateCurrentTokenId = () => {
    try {
      setCurrentTokenId(maybeTokenId);
    } catch (err: any) {
      setCurrentTokenId(undefined);
    }
  };

  const _loadMints = useCallback(async () => {
    setLoading(true);
    const mints: MintEvent[] = await fetch(
      "/api/mints" +
        (currentCollectionAddress ? currentCollectionAddress && currentTokenId ? `?address=${currentCollectionAddress}&tokenId=${currentTokenId}` : `?address=${currentCollectionAddress}` : '')
    ).then((res) => res.json());
    setMints(mints);
    setLoading(false);
  }, [currentCollectionAddress, currentTokenId]);

  useEffect(() => {
    const delayMS = (t = TIMEOUT_MAX_DELAY_MS) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(t);
        }, t);
      });
    };
    const loadMints = async () => {
      await Promise.all([_loadMints(), delayMS()]);
    };
    loadMints();
  }, [_loadMints]);

  const [selectedNFT, setSelectedNFT] = useState<MintEvent>();
  const selectedKey =
    selectedNFT &&
    genKey(
      selectedNFT.mint.transactionInfo.transactionHash,
      selectedNFT.mint.tokenId
    );
  return (
    <>
      <div
        style={{
          display: "flex",
          marginTop: "2rem",
          minWidth: "320px",
          maxWidth: "800px",
        }}
      >
        <InputGroup size="md">
          <Input
            pr={isLoading ? "7.5rem" : "5.5rem"}
            type="text"
            value={maybeCollectionAddress}
            placeholder="Search for a token collection"
            onChange={(e) => setMaybeCollectionAddress(e.target.value)}
          />
          <InputRightElement width={isLoading ? "7.5rem" : "5.5rem"}>
            <Button
              loadingText="Loading..."
              isLoading={isLoading}
              h="1.75rem"
              size="sm"
              onClick={() =>
                !currentCollectionAddress
                  ? updateCurrentCollectionAddress()
                  : (() => {
                      setMaybeCollectionAddress("");
                      setCurrentCollectionAddress("");
                    })()
              }
            >
              {!currentCollectionAddress ? "Search" : "Reset"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {currentCollectionAddress && (
          <InputGroup size="md" style={{ marginLeft: "10px"}}>
            <Input
              pr={isLoadingTokenId ? "7.5rem" : "5.5rem"}
              type="text"
              value={maybeTokenId}
              placeholder="Search for a token within collection"
              onChange={(e) => setMaybeTokenId(e.target.value)}
            />
            <InputRightElement width={isLoadingTokenId ? "7.5rem" : "5.5rem"}>
              <Button
                loadingText="Loading..."
                isLoading={isLoadingTokenId}
                h="1.75rem"
                size="sm"
                onClick={() =>
                  !currentTokenId
                    ? updateCurrentTokenId()
                    : (() => {
                        setMaybeTokenId("");
                        setCurrentTokenId("");
                      })()
                }
              >
                {!currentTokenId ? "Search" : "Reset"}
              </Button>
            </InputRightElement>
          </InputGroup>
        )}
      </div>
      {mints.length > 0 && (
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Minter</Th>
                <Th>Recipient</Th>
                <Th isNumeric>NFT Collection Name</Th>
                <Th>Transaction</Th>
                <Th>Token Id</Th>
                <Th>Mint Price</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mints.map((mint) => {
                const key = genKey(
                  mint.mint.transactionInfo.transactionHash,
                  mint.mint.tokenId
                );
                return (
                  <React.Fragment key={key}>
                    <Tr>
                      <Td>
                        <Address address={mint.mint.originatorAddress} />
                      </Td>
                      <Td>
                        <Address address={mint.mint.toAddress} />
                      </Td>
                      <Td>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Image
                            src={mint.token?.image?.mediaEncoding?.thumbnail}
                            width="32px"
                            height="32px"
                            alt={mint.token.collectionName}
                          />{" "}
                          <span style={{ padding: "0 10px" }}>
                            {mint.token.collectionName}
                          </span>
                        </div>
                      </Td>
                      <Td>
                        <Transaction
                          tx={mint.mint.transactionInfo.transactionHash}
                        />
                      </Td>
                      <Td isNumeric>{shorten(mint.mint.tokenId)}</Td>
                      <Td isNumeric>
                        {mint.mint.price.nativePrice.decimal.toString()}
                      </Td>
                      <Td>
                        <Button
                          onClick={() =>
                            key == selectedKey
                              ? setSelectedNFT(undefined)
                              : setSelectedNFT(mint)
                          }
                        >
                          {key == selectedKey ? "Hide" : "Offers"}
                        </Button>
                      </Td>
                    </Tr>
                    {selectedKey == key && (
                      <Tr>
                        <Td colSpan={7}>
                          <OfferTable mint={mint} />
                        </Td>
                      </Tr>
                    )}
                  </React.Fragment>
                );
              })}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Minter</Th>
                <Th>Recipient</Th>
                <Th isNumeric>NFT Collection Name</Th>
                <Th>Transaction</Th>
                <Th>Token Id</Th>
                <Th>Mint Price</Th>
                <Th>Actions</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      )}
    </>
  );
};
