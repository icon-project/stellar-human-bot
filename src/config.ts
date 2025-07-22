import { Keypair } from '@stellar/stellar-sdk';

export const FUND_WALLET_COUNT = 11;
export const CHILD_WALLET_COUNT = 350;
export const fundWallets: Keypair[] = [];
export const childWallets: Keypair[] = [];
export const pollingInterval = 1000;
export const timeoutDuration = 60000;
export const XCALL_ADDRESS = 'CB6IJRLOWGQXUDSYGFOAAZYVOESQ6TVSTU3242I7PG3LH7F43PPX2HE6';
export const ASSEST_MANAGER_ADDRESS = 'CAGP34E2VHGO7Y3NEJHCMVFMTTTIYCGBWUH7FTCMHMVYAMQBIILX5GXH';
export const BALANCED_DOLLAR_ADDRESS = 'CCT4ZYIYZ3TUO2AWQFEOFGBZ6HQP3GW5TA37CK7CRZVFRDXYTHTYX7KP';
export const STELLAR_NETWORK = 'https://mainnet.sorobanrpc.com';
export const HORIZON_NETWORK = 'https://horizon.stellar.lobstr.co';
export const MIN_COLLATERAL_AMOUNT = '35000000';
