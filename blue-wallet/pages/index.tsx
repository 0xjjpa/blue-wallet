import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { Text } from '@chakra-ui/react';

import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { MintTable } from '../components/MintTable';
import { MintEvent } from '../lib/types';
import styles from '../styles/Home.module.css';
import { SearchTable } from '../components/SearchTable';

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
        <p className={styles.descriptor}>The website loads the most recent NFT minted in the Rinkeby network. Click on any specific one to create an offer.</p>
          <p className={styles.descriptor}>You can also search for specific (e.g. 0x5950a611dd640d6e910c62d021c37aa6730417b2) NFTs minted.</p>
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
