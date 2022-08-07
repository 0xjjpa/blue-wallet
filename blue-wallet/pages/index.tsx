import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { Text } from '@chakra-ui/react';

import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { MintTable } from '../components/MintTable';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Blue Mage</title>
        <meta
          name="description"
          content="A utility to automate offers in the NFT market"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to <a href="">Blue Mage</a> <Image src="/images/bm.png" width="35px" height="50px" alt="Blue Mage" />
        </h1>

        <p className={styles.description}>
          A utility to automate offers in the NFT market.
        </p>

        <div className={styles.grid}>
        <p className={styles.descriptor}>The website loads the most recent NFT minted in the Ethereum network. Click on any specific one to create an offer.</p>
          <p className={styles.descriptor}>You can also search for specific (e.g. 0xCa21d4228cDCc68D4e23807E5e370C07577Dd152) NFTs minted.</p>
        </div>
        <MintTable/>
        
      </main>
      <DarkModeSwitch />
      <footer className={styles.footer}>
        <a href="https://twitter.com/0xjjpa" target="_blank" rel="noopener noreferrer">
          <Text as="pre">Made with ❤️ by 0xjjpa using RainbowKit 🌈</Text>
        </a>
      </footer>
    </div>
  );
};

export default Home;
