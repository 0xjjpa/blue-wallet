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
import React, { useCallback, useEffect, useState } from "react";
import { genKey } from "../lib/helpers";
import { MintEvent } from "../lib/types";
import { Address } from "./atoms/Address";
import { Transaction } from "./atoms/Transaction";
import { OfferTable } from "./OfferTable";

export const MintTable = () => {
  const TIMEOUT_MAX_DELAY_MS = 1000;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [mints, setMints] = useState<MintEvent[]>([]);
  const [maybeCollectionAddress, setMaybeCollectionAddress] =
    useState<string>("");
  const [currentCollectionAddress, setCurrentCollectionAddress] =
    useState<string>("");

  const updateCurrentCollectionAddress = () => {
    try {
      const validAddress = getAddress(maybeCollectionAddress);
      setCurrentCollectionAddress(validAddress);
    } catch (err: any) {
      setCurrentCollectionAddress("");
    }
  };

  const _loadMints = useCallback(async () => {
    setLoading(true);
    const mints: MintEvent[] = await fetch(
      "/api/mints" +
        (currentCollectionAddress && `?address=${currentCollectionAddress}`)
    ).then((res) => res.json());
    setMints(mints);
    setLoading(false);
  }, [currentCollectionAddress]);

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
      <div style={{ marginTop: "2rem", minWidth: "320px", maxWidth: "800px" }}>
        <InputGroup size="md">
          <Input
            pr="5.5rem"
            type="text"
            value={maybeCollectionAddress}
            placeholder="Search for a token collection"
            onChange={(e) => setMaybeCollectionAddress(e.target.value)}
          />
          <InputRightElement width="5.5rem">
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
                      <Td>{mint.token.collectionName}</Td>
                      <Td>
                        <Transaction
                          tx={mint.mint.transactionInfo.transactionHash}
                        />
                      </Td>
                      <Td isNumeric>{mint.mint.tokenId}</Td>
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
                        <Td colSpan={6}>
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
                <Th>Actions</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      )}
    </>
  );
};
