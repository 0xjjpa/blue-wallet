import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
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
          content="A mimic-like bot to automate offers in the NFT market"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to <a href="">Blue Mage</a> <Image src="/images/bm.png" width="35px" height="50px" alt="Blue Mage" />
        </h1>

        <p className={styles.description}>
          A mimic-like bot to automate offers in the NFT market.
        </p>

        <div className={styles.grid}>
          <a href="https://rainbowkit.com" className={styles.card}>
            <h2>RainbowKit Documentation &rarr;</h2>
            <p>Learn how to customize your wallet connection flow.</p>
          </a>

          <a href="https://wagmi.sh" className={styles.card}>
            <h2>wagmi Documentation &rarr;</h2>
            <p>Learn how to interact with Ethereum.</p>
          </a>

          <a
            href="https://github.com/rainbow-me/rainbowkit/tree/main/examples"
            className={styles.card}
          >
            <h2>RainbowKit Examples &rarr;</h2>
            <p>Discover boilerplate example RainbowKit projects.</p>
          </a>

          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Next.js Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Next.js Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://rainbow.me" target="_blank" rel="noopener noreferrer">
          Made with ❤️ by your frens at 🌈
        </a>
      </footer>
    </div>
  );
};

export default Home;
