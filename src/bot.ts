import { Asset, contract, Keypair } from '@stellar/stellar-sdk';
import { provideXlmCollateral, putBnUsdIntoSavings, swapUsdcBnUsd, takeOutBnUsdLoan } from './actions';
import {
  childWallets,
  MAX_CONCURRENT_WALLETS,
  MIN_BNUSD_LOAN_AMOUNT,
  MIN_COLLATERAL_AMOUNT,
  MIN_SAVINGS_AMOUNT,
  MIN_USDC_AMOUNT,
} from './config';
import { logOperation } from './logger';
import { loadWalletActionState, saveWalletActionState, walletActionState } from './walletActionState';

const USDC = new Asset('USDC', contract.NULL_ACCOUNT);
const bnUSD = new Asset('bnUSD', contract.NULL_ACCOUNT);

const actions = [
  async (wallet: Keypair) => {
    await provideXlmCollateral(wallet, MIN_COLLATERAL_AMOUNT);
    logOperation(`Wallet ${wallet.publicKey()} provided ${MIN_COLLATERAL_AMOUNT} XLM collateral.`);
  },
  async (wallet: Keypair) => {
    await takeOutBnUsdLoan(wallet, MIN_BNUSD_LOAN_AMOUNT);
    logOperation(`Wallet ${wallet.publicKey()} took out ${MIN_BNUSD_LOAN_AMOUNT} bnUSD loan.`);
  },
  async (wallet: Keypair) => {
    await swapUsdcBnUsd(wallet, USDC, bnUSD, MIN_USDC_AMOUNT);
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

async function manageWallet(wallet: Keypair) {
  const publicKey = wallet.publicKey();

  if (!walletActionState[publicKey]) {
    walletActionState[publicKey] = { nextActionIndex: 0 };
  }

  const state = walletActionState[publicKey];
  const actionIndex = state.nextActionIndex;
  const action = actions[actionIndex];

  try {
    logOperation(`Wallet ${publicKey} starting action #${actionIndex}.`);
    await action(wallet);
    logOperation(`Wallet ${publicKey} completed action #${actionIndex}.`);

    state.nextActionIndex = (actionIndex + 1) % actions.length;
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

  setInterval(processQueue, 1000); // Check the queue every second
  setInterval(saveWalletActionState, 30000);
}
