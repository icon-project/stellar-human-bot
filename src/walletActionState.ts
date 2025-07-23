import * as fs from 'node:fs';
import * as path from 'node:path';

const WALLET_ACTION_STATE_FILE = path.resolve(__dirname, '../logs/walletActionState.json');

// State tracks the next action index for each wallet
export const walletActionState: { [publicKey: string]: { nextActionIndex: number } } = {};

export function saveWalletActionState() {
  const logsDir = path.dirname(WALLET_ACTION_STATE_FILE);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  fs.writeFileSync(WALLET_ACTION_STATE_FILE, JSON.stringify(walletActionState, null, 2));
}

export function loadWalletActionState() {
  if (fs.existsSync(WALLET_ACTION_STATE_FILE)) {
    const data = fs.readFileSync(WALLET_ACTION_STATE_FILE, 'utf-8');
    if (data) {
      Object.assign(walletActionState, JSON.parse(data));
    }
  }
}
