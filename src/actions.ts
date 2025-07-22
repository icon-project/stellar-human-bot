import { RLP } from '@ethereumjs/rlp';
import {
  Account,
  Address,
  Asset,
  BASE_FEE,
  contract,
  Horizon,
  Keypair,
  Networks,
  nativeToScVal,
  Operation,
  rpc,
  TimeoutInfinite,
  Transaction,
  TransactionBuilder,
  xdr,
} from '@stellar/stellar-sdk';
import {
  ASSEST_MANAGER_ADDRESS,
  BALANCED_DOLLAR_ADDRESS,
  HORIZON_NETWORK,
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
  USDC_ASSET,
  USDC_TOKEN,
  XLM_TOKEN,
} from './const';
import { tokenData, uintToBytes } from './utils';

export const XLM = Asset.native();
export const bnUSD = new Asset('bnUSD', contract.NULL_ACCOUNT);
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

export async function fundChildWallets(fundWallet: Keypair, childWallets: Keypair[], amount?: string) {
  try {
    for (const childWallet of childWallets) {
      const tx = new TransactionBuilder(new Account(childWallet.publicKey(), '0'), {
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
            sponsoredId: fundWallet.publicKey(),
          }),
        )
        .addOperation(
          Operation.endSponsoringFutureReserves({
            source: childWallet.publicKey(),
          }),
        )
        .setTimeout(TimeoutInfinite)
        .build();
      tx.sign(childWallet);
      tx.sign(fundWallet);
      const result = await server.sendTransaction(tx);
      console.log(`Transaction to fund child wallet ${childWallet.publicKey()} successful:`, result);
    }
  } catch (error) {
    console.error('Error funding child wallets:', error);
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
    console.log(`Trustline for ${asset.getCode()} created successfully:`, result);
    return result.txHash;
  } catch (error) {
    console.error(`Error creating trustline for ${asset.getCode()}:`, error);
  }
  throw new Error(`Failed to create trustline for ${asset.getCode()} for wallet ${wallet.publicKey()}`);
}

/**
 * Provides XLM collateral.
 * @param wallet The keypair of the wallet providing collateral.
 * @param amount The amount of XLM to provide as collateral.
 */
export async function provideXlmCollateral(wallet: Keypair, amount: number) {
  console.log(`Providing ${amount} XLM collateral for wallet ${wallet.publicKey()}`);
  try {
    const from = new Address(wallet.publicKey()).toScVal();
    const token = new Address(XLM_TOKEN).toScVal();
    const destination = nativeToScVal(`${ICON_NETWORK_ID}/${ICON_STELLAR_DESTINATION}`);
    const amountVal = nativeToScVal(amount, { type: 'u128' });
    const data = Buffer.from(JSON.stringify({}));
    const op = Operation.invokeContractFunction({
      contract: ASSEST_MANAGER_ADDRESS,
      function: 'deposit',
      args: [from, token, destination, amountVal, nativeToScVal(data, { type: 'bytes' })],
    });
    const builtTransaction = await buildTransaction(wallet, [op]);
    const result = await submitTransaction(builtTransaction);
    console.log(`XLM collateral provided successfully for wallet ${wallet.publicKey()}:`, result);
    return result;
  } catch (error) {
    console.error(`Error providing XLM collateral for wallet ${wallet.publicKey()}:`, error);
  }
  throw new Error(`Failed to provide XLM collateral for wallet ${wallet.publicKey()}`);
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
    const data = Buffer.from(RLP.encode(['xBorrow', 10, uintToBytes(BigInt(amount))]));
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
    console.log(`bnUSD loan taken out successfully for wallet ${wallet.publicKey()}:`, result);
    return result.txHash;
  } catch (error) {
    console.error(`Error taking out bnUSD loan for wallet ${wallet.publicKey()}:`, error);
  }
  throw new Error(`Failed to take out bnUSD loan for wallet ${wallet.publicKey()}`);
}

/**
 * Swap some USDC from the stability fund using XLM.
 * @param wallet The keypair of the wallet requesting USDC.
 * @param amount The amount of USDC to request.
 */
export async function swapUSDCFromStabilityFund(wallet: Keypair, amount: string): Promise<string> {
  console.log(`Requesting ${amount} USDC from stability fund for wallet ${wallet.publicKey()}`);
  try {
    await changeTrustline(wallet, USDC_ASSET);
    const from = new Address(wallet.publicKey()).toScVal();
    const token = new Address(USDC_TOKEN).toScVal();
    const destination = nativeToScVal(`${ICON_NETWORK_ID}/${ICON_USDC_DESTINATION}`);
    const amountVal = nativeToScVal(amount, { type: 'u128' });
    const data = {
      method: '_swap',
      params: {
        path: [],
        receiver: `${ICON_NETWORK_ID}/${wallet.publicKey()}`,
      },
    };
    const op = Operation.invokeContractFunction({
      contract: ASSEST_MANAGER_ADDRESS,
      function: 'deposit',
      args: [from, token, destination, amountVal, nativeToScVal(Buffer.from(JSON.stringify(data)), { type: 'bytes' })],
    });
    const builtTransaction = await buildTransaction(wallet, [op]);
    const result = await submitTransaction(builtTransaction);
    console.log(`USDC requested successfully from stability fund for wallet ${wallet.publicKey()}:`, result);
    return result.txHash;
  } catch (error) {
    console.error(`Error requesting USDC from stability fund for wallet ${wallet.publicKey()}:`, error);
  }
  throw new Error(`Failed to request USDC from stability fund for wallet ${wallet.publicKey()}`);
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
    const data = {
      method: '_swap',
      params: {
        path: [],
        receiver: `${ICON_NETWORK_ID}/${wallet.publicKey()}`,
      },
    };
    const op = Operation.invokeContractFunction({
      contract: ASSEST_MANAGER_ADDRESS,
      function: 'deposit',
      args: [from, token, destination, amountVal, nativeToScVal(Buffer.from(JSON.stringify(data)), { type: 'bytes' })],
    });
    const builtTransaction = await buildTransaction(wallet, [op]);
    const result = await submitTransaction(builtTransaction);
    console.log(`XLM collateral provided successfully for wallet ${wallet.publicKey()}:`, result);
    return result.txHash;
  } catch (error) {
    console.error(`Error providing XLM collateral for wallet ${wallet.publicKey()}:`, error);
  }
  throw new Error(`Failed to provide XLM collateral for wallet ${wallet.publicKey()}`);
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
    const data = Buffer.from(tokenData('_deposit', { address: `stellar/${wallet.publicKey()}` }));
    const op = Operation.invokeContractFunction({
      contract: BALANCED_DOLLAR_ADDRESS,
      function: 'cross_transfer',
      args: [from, amountVal, destination, nativeToScVal(data, { type: 'bytes' })],
    });
    const builtTransaction = await buildTransaction(wallet, [op]);
    const result = await submitTransaction(builtTransaction);
    console.log(`bnUSD put into savings successfully for wallet ${wallet.publicKey()}:`, result);
    return result.txHash;
  } catch (error) {
    console.error(`Error putting bnUSD into savings for wallet ${wallet.publicKey()}:`, error);
  }
}
