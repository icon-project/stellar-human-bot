import { Keypair } from '@stellar/stellar-sdk';
import * as fs from 'node:fs';
import * as path from 'node:path';

const WALLET_FILE = path.resolve(__dirname, '../wallets.json');

interface StoredWallet {
  publicKey: string;
  secret: string;
}

export function saveWallets(fundWallets: Keypair[], childWallets: Keypair[]) {
  const data = {
    fundWallets: fundWallets.map(w => ({
      publicKey: w.publicKey(),
      secret: w.secret(),
    })),
    childWallets: childWallets.map(w => ({
      publicKey: w.publicKey(),
      secret: w.secret(),
    })),
  };
  fs.writeFileSync(WALLET_FILE, JSON.stringify(data, null, 2));
}

export function loadWallets() {
  if (!fs.existsSync(WALLET_FILE)) return null;
  const data = JSON.parse(fs.readFileSync(WALLET_FILE, 'utf-8'));
  return {
    fundWallets: data.fundWallets.map((w: StoredWallet) => Keypair.fromSecret(w.secret)),
    childWallets: data.childWallets.map((w: StoredWallet) => Keypair.fromSecret(w.secret)),
  };
}
