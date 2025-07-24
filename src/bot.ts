import { Asset, contract, Keypair } from '@stellar/stellar-sdk';
import { initWallet, provideXlmCollateral, putBnUsdIntoSavings, swapUsdcBnUsd, takeOutBnUsdLoan } from './actions';
import {
  childWallets,
  fundWallets,
  MAX_CONCURRENT_WALLETS,
  MIN_BNUSD_LOAN_AMOUNT,
  MIN_COLLATERAL_AMOUNT,
  MIN_SAVINGS_AMOUNT,
  MIN_USDC_AMOUNT,
} from './config';
import { USDC_ASSET } from './const';
import { logOperation } from './logger';
import { loadWalletActionState, saveWalletActionState, walletActionState } from './walletActionState';

const bnUSD = new Asset('bnUSD', contract.NULL_ACCOUNT);

const actions = [
  async (wallet: Keypair) => {
    const funder = fundWallets[getRandomInt(0, fundWallets.length - 1)];
    await initWallet(funder, wallet);
    logOperation(`Wallet ${wallet.publicKey()} initialized by ${funder.publicKey()}.`);
  },
  async (wallet: Keypair) => {
    await provideXlmCollateral(wallet, MIN_COLLATERAL_AMOUNT);
    logOperation(`Wallet ${wallet.publicKey()} provided ${MIN_COLLATERAL_AMOUNT} XLM collateral.`);
  },
  async (wallet: Keypair) => {
    await takeOutBnUsdLoan(wallet, MIN_BNUSD_LOAN_AMOUNT);
    logOperation(`Wallet ${wallet.publicKey()} took out ${MIN_BNUSD_LOAN_AMOUNT} bnUSD loan.`);
  },
  async (wallet: Keypair) => {
    await swapUsdcBnUsd(wallet, USDC_ASSET, bnUSD, MIN_USDC_AMOUNT);
    logOperation(`Wallet ${wallet.publicKey()} swapped ${MIN_USDC_AMOUNT} USDC to bnUSD.`);
  },
  async (wallet: Keypair) => {
    await putBnUsdIntoSavings(wallet, MIN_SAVINGS_AMOUNT);
    logOperation(`Wallet ${wallet.publicKey()} put ${MIN_SAVINGS_AMOUNT} bnUSD into savings.`);
  },
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

async function manageWallet(wallet: Keypair) {
  const publicKey = wallet.publicKey();
  const today = getTodayDateString();

  if (!walletActionState[publicKey]) {
    walletActionState[publicKey] = {
      isInitialized: false,
      nextActionIndex: 0,
      totalActions: 0,
      actionsToday: 0,
      lastActionDate: today,
      isSlowWallet: Math.random() < 0.3, // 30% of wallets are "slow"
      dailyActionLimit: getRandomInt(1, 3),
    };
  }

  const state = walletActionState[publicKey];

  // Reset daily action count if it's a new day
  if (state.lastActionDate !== today) {
    state.actionsToday = 0;
    state.lastActionDate = today;
    state.dailyActionLimit = getRandomInt(2, 4); // Reset daily limit
  }

  // "Two-day rule" for slow wallets
  if (state.isSlowWallet) {
    const lastAction = new Date(state.lastActionDate);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    if (lastAction > twoDaysAgo && state.actionsToday > 0) {
      // This wallet has acted in the last 2 days, so it should wait.
      return;
    }
  }

  // Check if the wallet has reached its daily action limit
  if (state.actionsToday >= state.dailyActionLimit) {
    return; // Done for today
  }

  const actionIndex = state.nextActionIndex;
  const action = actions[actionIndex];

  try {
    logOperation(`Wallet ${publicKey} starting action #${actionIndex}.`);
    await action(wallet);
    logOperation(`Wallet ${publicKey} completed action #${actionIndex}.`);

    state.nextActionIndex = (actionIndex + 1) % actions.length;
    state.totalActions += 1;
    state.actionsToday += 1;
    saveWalletActionState();
  } catch (error) {
    logOperation(`Error on wallet ${publicKey} action #${actionIndex}: ${error}`);
  }

  const waitTime = getRandomInt(30, 600) * 1000;
  logOperation(`Wallet ${publicKey} waiting for ${Math.round(waitTime / 1000)} seconds...`);
  await new Promise(resolve => setTimeout(resolve, waitTime));
}

export async function startBot() {
  console.log('Starting bot...');
  loadWalletActionState();

  const walletQueue = [...childWallets];
  const activeWallets = new Set<string>();

  async function processQueue() {
    if (activeWallets.size >= MAX_CONCURRENT_WALLETS) {
      return;
    }

    const wallet = walletQueue.shift();
    if (!wallet) {
      walletQueue.push(...childWallets); // Re-populate the queue if it's empty
      return;
    }

    const publicKey = wallet.publicKey();
    if (activeWallets.has(publicKey)) {
      walletQueue.push(wallet); // Re-queue if already active
      return;
    }

    activeWallets.add(publicKey);
    try {
      await manageWallet(wallet);
    } finally {
      activeWallets.delete(publicKey);
      walletQueue.push(wallet); // Re-queue for the next cycle
    }
  }

  setInterval(processQueue, 60 * 1000); // Check the queue every minute
  setInterval(saveWalletActionState, 30000);
}
