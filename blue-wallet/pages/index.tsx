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

const Home: NextPage = () => {
  const TIMEOUT_MAX_DELAY_MS = 1000;
  const [mints, setMints] = useState<MintEvent[]>([]);

  const _loadMints = useCallback(async () => {
    const mints: MintEvent[] = await fetch('/api/mints').then(res => res.json());
    setMints(mints);
  }, []);

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

        <MintTable mints={mints} />
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
