import { Link, Text } from "@chakra-ui/react";
import { etherscanBlockExplorers } from "wagmi";
import { truncate } from "../../lib/helpers";

export const Address = ({ address }: { address: string }) => (
  <Link
    isExternal
    href={`${etherscanBlockExplorers.rinkeby.url}/address/${address}`}
  >
    <Text as="pre">{truncate(address)}</Text>
  </Link>
);
