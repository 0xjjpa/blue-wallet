import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
  } from "@chakra-ui/react";
  import React, { useCallback, useEffect, useState } from "react";
  import { MintEvent, Offer } from "../lib/types";
  import { Address } from "./atoms/Address";

  
  export const OfferTable = ({ mint }: { mint: MintEvent }) => {
    const TIMEOUT_MAX_DELAY_MS = 1000;
    const [isLoading, setLoading] = useState<boolean>(false);
    const [offers, setOffers] = useState<Offer[]>([]);
    
    const _loadOffers = useCallback(async () => {
      setLoading(true);
      const indexes: number[] = await fetch(
        `/api/offers?address=${mint.mint.collectionAddress}&tokenId=${mint.mint.tokenId}`
      ).then(res => res.json())
      const offers: Offer[] = await fetch(
        `/api/offer?address=${mint.mint.collectionAddress}&tokenId=${mint.mint.tokenId}&index=${indexes.toString()}`
      ).then(res => res.json());
      setOffers(offers);
      setLoading(false);
    }, [mint]);
  
    useEffect(() => {
      const delayMS = (t = TIMEOUT_MAX_DELAY_MS) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(t);
          }, t);
        });
      };
      const loadOffers = async () => {
        await Promise.all([_loadOffers(), delayMS()]);
      };
      loadOffers();
    }, [_loadOffers]);
  
    return (
      <>
        {isLoading && <p>Loading...</p>}
        {offers.length > 0 && (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Maker</Th>
                  <Th>Currency</Th>
                  <Th>FindersFeeBps</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                {offers.map((offer) => {
                  return (
                    <React.Fragment key={JSON.stringify(offer)}>
                      <Tr>
                        <Td>
                          <Address address={offer.maker} />
                        </Td>
                        <Td>
                          {offer.currency}
                        </Td>
                        <Td>
                          {offer.findersFeeBps}
                        </Td>
                        <Td>
                          {offer.amount.toNumber()}
                        </Td>
                      </Tr>
                    </React.Fragment>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Maker</Th>
                  <Th>Currency</Th>
                  <Th>FindersFeeBps</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        )}
      </>
    );
  };
  