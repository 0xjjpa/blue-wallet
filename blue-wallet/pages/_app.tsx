import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ChakraProvider } from "@chakra-ui/react";

import "../styles/globals.css";

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
      ? [chain.rinkeby]
      : []),
  ],
  [
    alchemyProvider({
      // This is Alchemy's default API key.
      // You can get your own at https://dashboard.alchemyapi.io
      apiKey: "q87-K2Zf0V1tVdeTNbvb6dgZCJaBSgaa",
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Blue Mage",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
