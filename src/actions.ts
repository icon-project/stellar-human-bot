import {
  Asset,
  BASE_FEE,
  contract,
  Keypair,
  Networks,
  Operation,
  rpc,
  TimeoutInfinite,
  Transaction,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';
import { pollingInterval, timeoutDuration } from './config';

export const XLM = Asset.native();
export const bnUSD = new Asset('bnUSD', contract.NULL_ACCOUNT);
export const USDC = new Asset('USDC', contract.NULL_ACCOUNT);

const server = new rpc.Server('https://mainnet.stellar.org');

export async function pollTransactionCompletion(txHash: string): Promise<rpc.Api.GetTransactionResponse> {
  const startTime = Date.now();
  while (Date.now() - startTime < timeoutDuration) {
    try {
      const transaction = await server.getTransaction(txHash);
      switch (transaction.status) {
        case rpc.Api.GetTransactionStatus.SUCCESS:
          return transaction;
        case rpc.Api.GetTransactionStatus.FAILED:
          throw new Error(`Transaction ${txHash} failed`);
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
  const account = await server.getAccount(sourceAccount.publicKey());
  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.PUBLIC,
  }).setTimeout(TimeoutInfinite);

  for (const operation of op) {
    tx.addOperation(operation);
  }
  const builtTransaction = tx.build();
  builtTransaction.sign(sourceAccount);
  return builtTransaction;
}

export async function submitTransaction(tx: Transaction): Promise<rpc.Api.GetTransactionResponse> {
  try {
    const result = await server.sendTransaction(tx);
    console.log('Transaction successful:', result);
    return pollTransactionCompletion(result.hash);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error submitting transaction ${tx.hash()}: ${error.message}`);
    }
    throw new Error(`Error submitting transaction ${tx.hash()}: ${String(error)}`);
  }
}

export async function fundChildWallets(fundWallet: Keypair, childWallets: Keypair[], amount: string) {
  try {
    const operations: xdr.Operation[] = [];
    for (const childWallet of childWallets) {
      operations.push(
        Operation.createAccount({
          destination: childWallet.publicKey(),
          startingBalance: amount,
        }),
      );
    }
    const builtTransaction = await buildTransaction(fundWallet, operations);
    const result = await submitTransaction(builtTransaction);
    console.log('Transaction successful:', result);
  } catch (error) {
    console.error('Error funding child wallets:', error);
  }
}

/**
 * Provides XLM collateral.
 * @param wallet The keypair of the wallet providing collateral.
 * @param amount The amount of XLM to provide as collateral.
 */
export async function provideXlmCollateral(wallet: Keypair, amount: string) {
  console.log(`Providing ${amount} XLM collateral for wallet ${wallet.publicKey()}`);
  //  actual implementation for providing XLM collateral
}

/**
 * Takes out a bnUSD loan.
 * @param wallet The keypair of the wallet taking out the loan.
 * @param amount The amount of bnUSD to borrow.
 */
export async function takeOutBnUsdLoan(wallet: Keypair, amount: string) {
  console.log(`Taking out ${amount} bnUSD loan for wallet ${wallet.publicKey()}`);
  // actual implementation for taking out a bnUSD loan
}

/**
 * Swaps between USDC and bnUSD on Stellar (through stability fund).
 * @param wallet The keypair of the wallet performing the swap.
 * @param fromAsset The asset to swap from (USDC or bnUSD).
 * @param toAsset The asset to swap to (USDC or bnUSD).
 * @param amount The amount to swap.
 */
export async function swapUsdcBnUsd(wallet: Keypair, fromAsset: Asset, toAsset: Asset, amount: string) {
  console.log(`Swapping ${amount} ${fromAsset.getCode()} to ${toAsset.getCode()} for wallet ${wallet.publicKey()}`);
  // actual implementation for swapping USDC and bnUSD
}

/**
 * Puts bnUSD into savings.
 * @param wallet The keypair of the wallet putting bnUSD into savings.
 * @param amount The amount of bnUSD to put into savings.
 */
export async function putBnUsdIntoSavings(wallet: Keypair, amount: string) {
  console.log(`Putting ${amount} bnUSD into savings for wallet ${wallet.publicKey()}`);
  // actual implementation for putting bnUSD into savings
}
