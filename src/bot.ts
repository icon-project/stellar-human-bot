import { Asset, contract, Keypair } from '@stellar/stellar-sdk';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { provideXlmCollateral, putBnUsdIntoSavings, swapUsdcBnUsd, takeOutBnUsdLoan } from './actions';
import { childWallets } from './config';
import { logOperation } from './logger';

const USDC = new Asset('USDC', contract.NULL_ACCOUNT);
const bnUSD = new Asset('bnUSD', contract.NULL_ACCOUNT);

const actions = [
  async (wallet: Keypair, amount: number) => {
    await provideXlmCollateral(wallet, amount);
    logOperation(`Wallet ${wallet.publicKey()} provided ${amount} XLM collateral.`);
  },
  async (wallet: Keypair, amount: number) => {
    await takeOutBnUsdLoan(wallet, amount);
    logOperation(`Wallet ${wallet.publicKey()} took out ${amount} bnUSD loan.`);
  },
  async (wallet: Keypair, amount: number) => {
    await swapUsdcBnUsd(wallet, USDC, bnUSD, amount);
    logOperation(`Wallet ${wallet.publicKey()} swapped ${amount} USDC to bnUSD.`);
  },
  async (wallet: Keypair, amount: number) => {
    await swapUsdcBnUsd(wallet, bnUSD, USDC, amount);
    logOperation(`Wallet ${wallet.publicKey()} swapped ${amount} bnUSD to USDC.`);
  },
  async (wallet: Keypair, amount: number) => {
    await putBnUsdIntoSavings(wallet, amount);
    logOperation(`Wallet ${wallet.publicKey()} put ${amount} bnUSD into savings.`);
  },
];

const ACTION_COUNTERS_FILE = path.resolve(__dirname, '../actionCounters.json');

const actionCounters: { [publicKey: string]: { total: number; perDay: { [date: string]: number } } } = {};

function saveActionCounters() {
  fs.writeFileSync(ACTION_COUNTERS_FILE, JSON.stringify(actionCounters, null, 2));
}

function loadActionCounters() {
  if (fs.existsSync(ACTION_COUNTERS_FILE)) {
    const data = JSON.parse(fs.readFileSync(ACTION_COUNTERS_FILE, 'utf-8'));
    Object.assign(actionCounters, data);
  }
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function runRandomAction() {
  const wallet = getRandomElement(childWallets);
  const action = getRandomElement(actions);

  const publicKey = wallet.publicKey();
  const today = new Date().toISOString().split('T')[0];

  if (!actionCounters[publicKey]) {
    actionCounters[publicKey] = { total: 0, perDay: {} };
  }
  if (!actionCounters[publicKey].perDay[today]) {
    actionCounters[publicKey].perDay[today] = 0;
  }

  // Optional: 30% of wallets only do an action once every 2 days
  if (Math.random() < 0.3) {
    const dates = Object.keys(actionCounters[publicKey].perDay).sort();
    if (dates.length > 0) {
      const lastActionDate = new Date(dates[dates.length - 1]);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      if (lastActionDate > twoDaysAgo) {
        console.log(`Skipping action for wallet ${publicKey} due to 2-day rule.`);
        return;
      }
    }
  }

  const amount = 100; // Example amount
  await action(wallet, amount);

  actionCounters[publicKey].total++;
  actionCounters[publicKey].perDay[today]++;
  saveActionCounters();

  console.log('Action counters:', JSON.stringify(actionCounters, null, 2));
}

export function startBot() {
  console.log('Starting bot...');
  loadActionCounters();

  async function loop() {
    await runRandomAction();
    const waitTime = getRandomInt(30, 600) * 1000; // Wait between 30 seconds and 10 minutes randomly
    console.log(`Waiting for ${Math.round(waitTime / 1000)} seconds...`);
    setTimeout(loop, waitTime);
  }

  loop();
}
