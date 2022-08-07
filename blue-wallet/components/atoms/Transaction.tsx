import { Link, Text } from "@chakra-ui/react";
import { etherscanBlockExplorers } from "wagmi";
import { truncate } from "../../lib/helpers";

export const Transaction = ({ tx }: { tx: string }) => (
  <Link
    isExternal
    href={`${etherscanBlockExplorers.mainnet.url}/tx/${tx}`}
  >
    <Text as="pre">{truncate(tx, 60)}</Text>
  </Link>
);
