import { addresses, SupportedChainId as ChainId } from '@balancednetwork/balanced-js';
import { XChainId } from '@balancednetwork/sdk-core';
import { Asset } from '@stellar/stellar-sdk';
import { XToken } from './types';

export const USDC_ASSET = new Asset('USDC', 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN');
export const USDC_TOKEN = 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75';
export const XLM_TOKEN = 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA';
export const ICON_NETWORK_ID = '0x1.icon';
export const ICON_STELLAR_DESTINATION = 'cx66d4d90f5f113eba575bf793570135f9b10cece1';
export const ICON_TO_SOURCE = 'cxdbfb9d63e84e6ad6ab301a2f2ef6b6e6e9227cbe';
export const ICON_USDC_DESTINATION = 'cx21e94c08c03daee80c25d8ee3ea22a20786ec231';
export const ICON_SAVINGS_DESTINATION = 'cxd82fb5d3effecd8c9071a4bba3856ad7222c4b91';
export const STELLAR_RLP_MSG_TYPE = { type: 'symbol' };
export const STELLAR_RLP_DATA_TYPE = {
  type: {
    data: ['symbol', null],
  },
};
export const STELLAR_RLP_ENVELOPE_TYPE = {
  type: {
    destinations: ['symbol', null],
    sources: ['symbol', null],
    message: ['symbol', null],
  },
};

export const xTokenMap: { [key in XChainId]: XToken[] } = {
  '0x1.icon': [
    new XToken('0x1.icon', ChainId.MAINNET, 'cx0000000000000000000000000000000000000000', 18, 'ICX', 'ICX'),
    new XToken('0x1.icon', ChainId.MAINNET, addresses[ChainId.MAINNET].bnusd, 18, 'bnUSD', 'Balanced Dollar'),
    new XToken(
      '0x1.icon',
      ChainId.MAINNET,
      'cxfe94530ee0d159db3e5b7dcffbcd0dfb360075c0',
      18,
      'sARCH',
      'Staked Archway',
    ),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx22319ac7f412f53eabe3c9827acf5e27e9c6a95f', 6, 'USDC', 'USDC'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx66a031cc3bd305c76371fb586e93801b948254f0', 18, 'AVAX', 'AVAX'),
    new XToken(
      '0x1.icon',
      ChainId.MAINNET,
      'cxf0a30d09ade391d7b570908b9b46cfa5b3cbc8f8',
      18,
      'hyTB',
      'HiYield Treasury Bill',
    ),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx2d552c485ec8bcaa75aac02424e2aca6ffdb2f1b', 18, 'BNB', 'BNB'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx288d13e1b63563459a2ac6179f237711f6851cb5', 18, 'ETH', 'ETH'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cxce7b23917ddf57656010decd6017fe5016de681b', 18, 'weETH', 'Wrapped eETH'),
    new XToken(
      '0x1.icon',
      ChainId.MAINNET,
      'cxb940dbfbc45c92f3a0cde464c4331102e7a84da8',
      18,
      'wstETH',
      'Wrapped stETH',
    ),
    new XToken('0x1.icon', ChainId.MAINNET, 'cxe2da9f10bc6e2754347bde2ef73379bd398fd9f3', 18, 'HVH', 'HVH'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx07b184a37f03c6ab681fcbd0b45aec6dc3eafbeb', 18, 'BTC', 'Bitcoin', 'BTC1'),
    new XToken(
      '0x1.icon',
      ChainId.MAINNET,
      'cx15ddac8c2663bd7e71ca1688dffa426070752fbd',
      18,
      'tBTC',
      'Threshold Bitcoin',
    ),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx4297f4b63262507623b6ad575d0d8dd2db980e4e', 18, 'INJ', 'INJ'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx16f3cb9f09f5cdd902cf07aa752c8b3bd1bc9609', 6, 'USDT', 'Tether USD'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx518f64edcd35db9044a2de63fdc10abfd5f7d611', 7, 'XLM', 'XLM'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx508002ec116fbf3ab406329c0df28e70d7e75fb3', 9, 'SUI', 'SUI'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx65c9e3d4fea842e00add0d32a5b4c5e4e04c7a6b', 9, 'SOL', 'SOL'),
    new XToken(
      '0x1.icon',
      ChainId.MAINNET,
      'cx4b48a4789636aa737285feec8908c765d8bc8042',
      9,
      'JitoSOL',
      'Jito Staked SOL',
    ),
    new XToken('0x1.icon', ChainId.MAINNET, 'cxb9d0727849a6ce6453f8c9dda2dec2fd543075d4', 9, 'vSUI', 'Volo Staked SUI'),
    new XToken(
      '0x1.icon',
      ChainId.MAINNET,
      'cx0664cceb34d391ba78a897200fab94b9b49443d0',
      9,
      'haSUI',
      'Haedal Staked SUI',
    ),
    new XToken(
      '0x1.icon',
      ChainId.MAINNET,
      'cx27fa4bdb0522e3be5a51daab06eb39889fb4c8da',
      9,
      'afSUI',
      'Aftermath Staked SUI',
    ),
    new XToken(
      '0x1.icon',
      ChainId.MAINNET,
      'cxb8cf9a4700e0c804b780978bf9d9de759c62e787',
      9,
      'mSUI',
      'Mirai Staked SUI',
    ),
    new XToken('0x1.icon', ChainId.MAINNET, 'cx2609b924e33ef00b648a409245c7ea394c467824', 18, 'sICX', 'Staked ICX'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cxf61cd5a45dc9f91c15aa65831a30a90d59a09619', 18, 'BALN', 'Balance Token'),
    new XToken('0x1.icon', ChainId.MAINNET, 'cxf594ce6068da86b9a0fd0dfa8f969a7eab8aa7a7', 18, 'POL', 'Polygon'),
  ],

  '0x100.icon': [
    new XToken('0x100.icon', 0x100, 'hx0000000000000000000000000000000000000000', 18, 'HVH', 'HVH'),
    new XToken('0x100.icon', 0x100, 'cx4b40466250f9ccf04cc92da1b6633968ba3ec7cc', 18, 'bnUSD', 'Balanced Dollar'),
  ],
  stellar: [
    new XToken('stellar', 'stellar', 'CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA', 7, 'XLM', 'XLM'),
    new XToken(
      'stellar',
      'stellar',
      'CCT4ZYIYZ3TUO2AWQFEOFGBZ6HQP3GW5TA37CK7CRZVFRDXYTHTYX7KP',
      18,
      'bnUSD',
      'Balanced Dollar',
    ),
    new XToken(
      'stellar',
      'stellar',
      'CDGAJ3DD5X6RQS5CNHUX4EZ6GPLCGLQ2D674QORAN23A26BKDIVADOUU',
      18,
      'sICX',
      'Staked ICX',
    ),
    new XToken(
      'stellar',
      'stellar',
      'CBCY2LVGYB5R2UYB5BX4JWBCQNVXUCVPJRD2RPTK765FYCQOWQL6MXII',
      18,
      'BALN',
      'Balance Token',
    ),
    new XToken('stellar', 'stellar', 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75', 7, 'USDC', 'USD Coin'),
  ],
};
