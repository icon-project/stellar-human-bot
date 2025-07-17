import { Keypair } from '@stellar/stellar-sdk';
import { CHILD_WALLET_COUNT, childWallets, FUND_WALLET_COUNT, fundWallets } from './config';

function generateWallets(count: number): Keypair[] {
  const wallets: Keypair[] = [];
  for (let i = 0; i < count; i++) {
    wallets.push(Keypair.random());
  }
  return wallets;
}

export function createWallets() {
  fundWallets.length = 0;
  childWallets.length = 0;

  fundWallets.push(...generateWallets(FUND_WALLET_COUNT));
  childWallets.push(...generateWallets(CHILD_WALLET_COUNT));

  console.log(`Generated ${FUND_WALLET_COUNT} fund wallets.`);
  console.log(`Generated ${CHILD_WALLET_COUNT} child wallets.`);
}

export function showFundWalletPublicKeys() {
  console.log('\n--- Fund Wallet Public Keys ---');
  fundWallets.forEach((wallet, index) => {
    console.log(`Wallet ${index + 1}: ${wallet.publicKey()}`);
  });
  console.log('---------------------------------\n');
}
