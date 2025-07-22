import { Currency, CurrencyAmount } from '@balancednetwork/sdk-core';
import { RLP } from '@ethereumjs/rlp';
import rlp from 'rlp';
import { ICON_NETWORK_ID, xTokenMap } from './const';
import { PairType, RouteAction, XToken } from './types';

export const toICONDecimals = (currencyAmount: CurrencyAmount<Currency>): bigint => {
  const xAmount = BigInt(currencyAmount.quotient.toString());
  const iconToken = xTokenMap[ICON_NETWORK_ID].find(token => token.symbol === currencyAmount.currency.symbol) as XToken;

  if (iconToken.decimals === currencyAmount.currency.decimals) return xAmount;

  const diff = BigInt(iconToken.decimals - currencyAmount.currency.decimals);
  return xAmount * BigInt(10) ** diff;
};

// Function to get the last i bytes of an integer
function lastBytesOf(x: bigint, i: number): Uint8Array {
  const buffer = new ArrayBuffer(i);
  const view = new DataView(buffer);
  for (let j = 0; j < i; j++) {
    view.setUint8(j, Number((x >> BigInt(8 * (i - j - 1))) & BigInt(0xff)));
  }
  return new Uint8Array(buffer);
}

// Function to convert an unsigned integer to bytes
export function uintToBytes(x: bigint): Uint8Array {
  if (x === BigInt(0)) {
    return new Uint8Array([0]);
  }
  let right = BigInt(0x80);
  for (let i = 1; i < 32; i++) {
    if (x < right) {
      return lastBytesOf(x, i);
    }
    right <<= BigInt(8);
  }
  if (x < right) {
    return RLP.encode(x);
  }
  const data = RLP.encode(x);
  data[0] = 0;
  return data;
}

export function getBytesFromNumber(value: number): Buffer {
  const hexString = value.toString(16).padStart(2, '0');
  return Buffer.from(hexString.length % 2 === 1 ? '0' + hexString : hexString, 'hex');
}

export function getBytesFromAddress(address: string | null): Buffer {
  // f8 is hardcoded, it will be replaced after rlp encoded, because rlp package doesn't support encoding null.
  //  rlpEncodedDataStr = rlpEncodedDataStr.replaceAll('c30181f8', 'c301f800');

  return Buffer.from(address?.replace('cx', '01') ?? 'f8', 'hex');
}

export function getRlpEncodedMsg(msg: string | any[]) {
  return Array.from(rlp.encode(msg));
}

export function getRlpEncodedSwapData(
  path: RouteAction[],
  method?: string,
  receiver?: string,
  minReceived?: CurrencyAmount<Currency>,
): Buffer {
  const encodedComponents: any = [];
  if (method) {
    encodedComponents.push(Buffer.from(method, 'utf-8'));
  }
  if (receiver) {
    encodedComponents.push(Buffer.from(receiver, 'utf-8'));
  }
  if (minReceived) {
    encodedComponents.push(uintToBytes(minReceived.quotient));
  }

  const routeActionPathEncoding = path.map(action => [
    getBytesFromNumber(action.type === PairType.STABILITY_FUND ? 2 : 1),
    getBytesFromAddress(action.address),
  ]);

  const rlpEncodedData = Buffer.from(getRlpEncodedMsg([...encodedComponents, ...routeActionPathEncoding]));

  let rlpEncodedDataStr = rlpEncodedData.toString('hex');
  rlpEncodedDataStr = rlpEncodedDataStr.replaceAll('c30181f8', 'c301f800');

  const rlpEncodedDataBuffer = Buffer.from(rlpEncodedDataStr, 'hex');

  return rlpEncodedDataBuffer;
}

export function tokenData(method: string, params: Record<string, any>): string {
  const map = {
    method: method,
    params: params,
  };

  return JSON.stringify(map);
}
