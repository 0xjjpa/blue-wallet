import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  Link,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { genKey } from "../lib/helpers";
import { MintEvent } from "../lib/types";
import { Address } from "./atoms/Address";
import { Transaction } from "./atoms/Transaction";

export const MintTable = ({ mints = [] }: { mints: MintEvent[] }) => {
  const [selectedNFT, setSelectedNFT] = useState<MintEvent>();
  const selectedKey =
    selectedNFT &&
    genKey(
      selectedNFT.mint.transactionInfo.transactionHash,
      selectedNFT.mint.tokenId
    );
  return (
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
                    <Button onClick={() => key == selectedKey ? setSelectedNFT(undefined) : setSelectedNFT(mint)}>
                      {key == selectedKey ? "Hide" : "Inspect"}
                    </Button>
                  </Td>
                </Tr>
                <Tr style={selectedKey != key ? { display: "none" } : {}}>
                  <Td colSpan={6}>Hello world.</Td>
                </Tr>
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
  );
};
