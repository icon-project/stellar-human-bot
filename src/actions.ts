import { RLP } from '@ethereumjs/rlp';
import {
  Address,
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  nativeToScVal,
  Networks,
  Operation,
  rpc,
  TimeoutInfinite,
  Transaction,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';
import {
  ASSET_MANAGER_ADDRESS,
  BALANCED_DOLLAR_ADDRESS,
  HORIZON_NETWORK,
  MIN_FUNDING_AMOUNT,
  pollingInterval,
  STELLAR_NETWORK,
  timeoutDuration,
  XCALL_ADDRESS,
} from './config';
import {
  ICON_NETWORK_ID,
  ICON_SAVINGS_DESTINATION,
  ICON_STELLAR_DESTINATION,
  ICON_TO_SOURCE,
  ICON_USDC_DESTINATION,
  STELLAR_RLP_DATA_TYPE,
  STELLAR_RLP_MSG_TYPE,
  USDC_TOKEN,
  XLM_TOKEN,
} from './const';
import { getRlpEncodedSwapData, tokenData, uintToBytes } from './utils';
import { walletActionState } from './walletActionState';

const server = new rpc.Server(STELLAR_NETWORK);
const horizon = new Horizon.Server(HORIZON_NETWORK);

export async function pollTransactionCompletion(txHash: string): Promise<rpc.Api.GetSuccessfulTransactionResponse> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutDuration) {
    try {
      const transaction = await server.getTransaction(txHash);
      switch (transaction.status) {
        case rpc.Api.GetTransactionStatus.SUCCESS:
          return transaction;
        case rpc.Api.GetTransactionStatus.FAILED:
          throw new Error(
            `Transaction ${txHash} failed with status: ${transaction.status} with resultXdr: ${JSON.stringify(transaction.resultXdr)}`,
          );
        case rpc.Api.GetTransactionStatus.NOT_FOUND:
          break;
        default:
          throw new Error(`Unexpected transaction status: ${txHash}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error fetching transaction ${txHash}: ${error.message}`);
      }
      throw new Error(`Error fetching transaction ${txHash}: ${String(error)}`);
    }
    await new Promise(resolve => setTimeout(resolve, pollingInterval));
  }
  throw new Error(`Transaction ${txHash} did not complete within the timeout period`);
}

export async function buildTransaction(sourceAccount: Keypair, op: xdr.Operation[]): Promise<Transaction> {
  try {
    const account = await server.getAccount(sourceAccount.publicKey());
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.PUBLIC,
    }).setTimeout(TimeoutInfinite);

    for (const operation of op) {
      tx.addOperation(operation);
    }
    const builtTransaction = tx.build();
    const preparedTransaction = await server.prepareTransaction(builtTransaction);
    preparedTransaction.sign(sourceAccount);
    return preparedTransaction;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error building transaction: ${error.message}`);
    }
    throw new Error(`Error building transaction: ${String(error)}`);
  }
}

export async function submitTransaction(tx: Transaction): Promise<rpc.Api.GetSuccessfulTransactionResponse> {
  try {
    const result = await server.sendTransaction(tx);
    if (result.status !== 'PENDING') {
      throw new Error(`Transaction ${result.hash} failed with error: ${JSON.stringify(result.errorResult)}`);
    }
    return await pollTransactionCompletion(result.hash);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error submitting transaction: ${error.message}`);
    }
    throw new Error(`Error submitting transaction: ${String(error)}`);
  }
}

export async function fundWallet(fundWallet: Keypair, childWallet: Keypair, amount?: string): Promise<string> {
  try {
    const account = await server.getAccount(fundWallet.publicKey());
    const tx = new TransactionBuilder(account, {
      fee: BASE_FEE,
      networkPassphrase: Networks.PUBLIC,
    })
      .addOperation(
        Operation.createAccount({
          destination: childWallet.publicKey(),
          startingBalance: amount || '0',
        }),
      )
      .addOperation(
        Operation.beginSponsoringFutureReserves({
          sponsoredId: childWallet.publicKey(),
        }),
      )
      .addOperation(
        Operation.endSponsoringFutureReserves({
          source: childWallet.publicKey(),
        }),
      )
      .setTimeout(TimeoutInfinite)
      .build();
    tx.sign(fundWallet, childWallet);
    const result = await server.sendTransaction(tx);
    const completedTransaction = await pollTransactionCompletion(result.hash);
    return completedTransaction.txHash;
  } catch (error: unknown) {
    throw new Error(
      `Failed to fund child wallet ${childWallet.publicKey()}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function changeTrustline(wallet: Keypair, asset: Asset): Promise<string | undefined> {
  try {
    const account = await horizon.loadAccount(wallet.publicKey());
    const trustlines = account.balances.filter(
      balance => balance.asset_type === 'credit_alphanum4' && balance.asset_code === asset.getCode(),
    );
    if (trustlines.length > 0) {
      console.log(`Trustline for ${asset.getCode()} already exists for wallet ${wallet.publicKey()}`);
      return;
    }
    const operations: xdr.Operation[] = [Operation.changeTrust({ asset })];
    const builtTransaction = await buildTransaction(wallet, operations);
    const result = await submitTransaction(builtTransaction);
    console.log(`Trustline for ${asset.getCode()} created successfully:`, result.returnValue);
    return result.txHash;
  } catch (error) {
    console.error(`Error creating trustline for ${asset.getCode()}:`, error);
  }
  throw new Error(`Failed to create trustline for ${asset.getCode()} for wallet ${wallet.publicKey()}`);
}

/**
 * Init wallet action state for a new wallet, sponsor it with a minimum of 40 XLM.
 * This function should be called when a new wallet is created.
 * It initializes the wallet's action state and sponsors it with a minimum amount of XLM.
 * @param wallet The keypair of the wallet to initialize
 */
export async function initWallet(sponsor: Keypair, wallet: Keypair): Promise<void> {
  const publicKey = wallet.publicKey();
  if (!walletActionState[publicKey]) {
    walletActionState[publicKey] = {
      isInitialized: false,
      nextActionIndex: 0,
      totalActions: 0,
      actionsToday: 0,
      lastActionDate: new Date().toISOString().split('T')[0],
      isSlowWallet: Math.random() < 0.3,
      dailyActionLimit: Math.random() < 0.5 ? 2 : 3,
    };
  }

  if (walletActionState[publicKey].isInitialized) {
    console.log(`Wallet ${publicKey} is already initialized.`);
    return;
  }

  try {
    console.log(`Initializing wallet ${publicKey} with ${MIN_FUNDING_AMOUNT} XLM...`);
    await fundWallet(sponsor, wallet, MIN_FUNDING_AMOUNT);
    walletActionState[publicKey].isInitialized = true;
    walletActionState[publicKey].fundedBy = sponsor.publicKey();
    console.log(`Wallet ${publicKey} initialized with ${MIN_FUNDING_AMOUNT} XLM and action state set.`);
  } catch (error: unknown) {
    throw new Error(
      `Failed to initialize wallet ${publicKey}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

/**
 * Provides XLM collateral.
 * @param wallet The keypair of the wallet providing collateral.
 * @param amount The amount of XLM to provide as collateral.
 */
export async function provideXlmCollateral(wallet: Keypair, amount: number): Promise<string | undefined> {
  console.log(`Providing ${amount / 1e7} XLM collateral for wallet ${wallet.publicKey()}`);
  try {
    const from = new Address(wallet.publicKey()).toScVal();
    const token = new Address(XLM_TOKEN).toScVal();
    const amountVal = nativeToScVal(amount, { type: 'u128' });
    const destination = nativeToScVal(`${ICON_NETWORK_ID}/${ICON_STELLAR_DESTINATION}`);
    const data = Buffer.from(JSON.stringify({}));
    const op = Operation.invokeContractFunction({
      contract: ASSET_MANAGER_ADDRESS,
      function: 'deposit',
      args: [from, token, amountVal, destination, nativeToScVal(data, { type: 'bytes' })],
    });
    const builtTransaction = await buildTransaction(wallet, [op]);
    const result = await submitTransaction(builtTransaction);
    console.log(`XLM collateral provided successfully for wallet ${wallet.publicKey()}:`, result.txHash);
    return result.txHash;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to provide XLM collateral for wallet ${wallet.publicKey()}: ${error.message}`);
    }
    throw new Error(`Failed to provide XLM collateral for wallet ${wallet.publicKey()}: ${String(error)}`);
  }
}

/**
 * Takes out a bnUSD loan.
 * @param wallet The keypair of the wallet taking out the loan.
 * @param amount The amount of bnUSD to borrow.
 */
export async function takeOutBnUsdLoan(wallet: Keypair, amount: number): Promise<string> {
  console.log(`Taking out ${amount} bnUSD loan for wallet ${wallet.publicKey()}`);
  try {
    const origin = new Address(wallet.publicKey()).toScVal();
    const sender = new Address(wallet.publicKey()).toScVal();
    const data = Buffer.from(RLP.encode(['xBorrow', 'XLM', uintToBytes(BigInt(amount))]));
    const envelope = {
      destinations: [ICON_TO_SOURCE],
      message: [nativeToScVal('CallMessage', STELLAR_RLP_MSG_TYPE), nativeToScVal({ data }, STELLAR_RLP_DATA_TYPE)],
      sources: [XLM_TOKEN],
    };
    const destination = `${ICON_NETWORK_ID}/${ICON_STELLAR_DESTINATION}`;
    const op = Operation.invokeContractFunction({
      contract: XCALL_ADDRESS,
      function: 'send_call',
      args: [origin, sender, nativeToScVal(envelope, STELLAR_RLP_DATA_TYPE), nativeToScVal(destination)],
    });
    const builtTransaction = await buildTransaction(wallet, [op]);
    const result = await submitTransaction(builtTransaction);
    console.log(`bnUSD loan taken out successfully for wallet ${wallet.publicKey()}:`, result.txHash);
    return result.txHash;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error taking out bnUSD loan for wallet ${wallet.publicKey()}: ${error.message}`);
    }
    throw new Error(`Error taking out bnUSD loan for wallet ${wallet.publicKey()}: ${String(error)}`);
  }
}

/**
 * Swaps between USDC and bnUSD on Stellar (through stability fund).
 * @param wallet The keypair of the wallet performing the swap.
 * @param fromAsset The asset to swap from (USDC or bnUSD).
 * @param toAsset The asset to swap to (USDC or bnUSD).
 * @param amount The amount to swap.
 */
export async function swapUsdcBnUsd(
  wallet: Keypair,
  fromAsset: Asset,
  toAsset: Asset,
  amount: number,
): Promise<string> {
  console.log(`Swapping ${amount} ${fromAsset.getCode()} to ${toAsset.getCode()} for wallet ${wallet.publicKey()}`);
  try {
    const from = new Address(wallet.publicKey()).toScVal();
    const token = new Address(USDC_TOKEN).toScVal();
    const destination = nativeToScVal(`${ICON_NETWORK_ID}/${ICON_USDC_DESTINATION}`);
    const amountVal = nativeToScVal(amount, { type: 'u128' });
    const data = getRlpEncodedSwapData([{ type: 2, address: 'cx22319ac7f412f53eabe3c9827acf5e27e9c6a95f' }], '_swap');
    const op = Operation.invokeContractFunction({
      contract: ASSET_MANAGER_ADDRESS,
      function: 'deposit',
      args: [from, token, amountVal, destination, nativeToScVal(Buffer.from(JSON.stringify(data)), { type: 'bytes' })],
    });
    const builtTransaction = await buildTransaction(wallet, [op]);
    const result = await submitTransaction(builtTransaction);
    console.log(`XLM collateral provided successfully for wallet ${wallet.publicKey()}:`, result.returnValue);
    return result.txHash;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(
        `Error swapping ${fromAsset.getCode()} to ${toAsset.getCode()} for wallet ${wallet.publicKey()}: ${error.message}`,
      );
    }
    throw new Error(
      `Error swapping ${fromAsset.getCode()} to ${toAsset.getCode()} for wallet ${wallet.publicKey()}: ${String(error)}`,
    );
  }
}

/**
 * Puts bnUSD into savings.
 * @param wallet The keypair of the wallet putting bnUSD into savings.
 * @param amount The amount of bnUSD to put into savings.
 */
export async function putBnUsdIntoSavings(wallet: Keypair, amount: number): Promise<string | undefined> {
  console.log(`Putting ${amount} bnUSD into savings for wallet ${wallet.publicKey()}`);
  try {
    const from = new Address(wallet.publicKey()).toScVal();
    const amountVal = nativeToScVal(amount, { type: 'u128' });
    const destination = nativeToScVal(`${ICON_NETWORK_ID}/${ICON_SAVINGS_DESTINATION}`);
    const data = Buffer.from(tokenData('_lock', { to: `stellar/${wallet.publicKey()}` }));
    const op = Operation.invokeContractFunction({
      contract: BALANCED_DOLLAR_ADDRESS,
      function: 'cross_transfer',
      args: [from, amountVal, destination, nativeToScVal(data, { type: 'bytes' })],
    });
    const builtTransaction = await buildTransaction(wallet, [op]);
    const result = await submitTransaction(builtTransaction);
    console.log(`bnUSD put into savings successfully for wallet ${wallet.publicKey()}:`, result.returnValue);
    return result.txHash;
  } catch (error: unknown) {
    throw new Error(
      `Failed to put bnUSD into savings for wallet ${wallet.publicKey()}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
