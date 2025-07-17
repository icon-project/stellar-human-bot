import { startBot } from './bot';
import { childWallets, fundWallets } from './config';
import { loadWallets, saveWallets } from './walletStore';
import { createWallets, showFundWalletPublicKeys } from './wallets';

async function main() {
  const loaded = loadWallets();
  if (loaded) {
    fundWallets.length = 0;
    childWallets.length = 0;
    fundWallets.push(...loaded.fundWallets);
    childWallets.push(...loaded.childWallets);
    console.log('Loaded wallets from file.');
  } else {
    console.log('Generating new wallets.');
    createWallets();
    saveWallets(fundWallets, childWallets);
    console.log('Wallets generated and saved.');
  }

  showFundWalletPublicKeys();
  console.log('Starting bot operations...');
  startBot();
}

main().catch(console.error);
