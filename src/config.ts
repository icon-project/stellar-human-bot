import { Keypair } from '@stellar/stellar-sdk';

export const FUND_WALLET_COUNT = 11;
export const CHILD_WALLET_COUNT = 350;
export const fundWallets: Keypair[] = [];
export const childWallets: Keypair[] = [];
export const pollingInterval = 1000;
export const timeoutDuration = 60000;
export const STABILITY_FUND_ADDRESS = 'GAD22KN7Z53GN7472T42N744X7B7Y6W6Z5J3Z5Y5Y6Z5J3Z5Y5Y6Z5J3';
export const SAVINGS_ADDRESS = 'GAX5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5';
