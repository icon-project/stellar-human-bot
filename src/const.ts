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
  'archway-1': [
    new XToken('archway-1', 'archway-1', '0x0000000000000000000000000000000000000000', 18, 'aARCH', 'Arch'),
    new XToken(
      'archway-1',
      'archway-1',
      'archway1l3m84nf7xagkdrcced2y0g367xphnea5uqc3mww3f83eh6h38nqqxnsxz7',
      18,
      'bnUSD',
      'Balanced Dollar',
    ),
    new XToken(
      'archway-1',
      'archway-1',
      'archway1t2llqsvwwunf98v692nqd5juudcmmlu3zk55utx7xtfvznel030saclvq6',
      18,
      'sARCH',
      'Staked Arch',
    ),
  ],
  '0xa86a.avax': [
    new XToken('0xa86a.avax', 43114, '0x0000000000000000000000000000000000000000', 18, 'AVAX', 'AVAX'),
    new XToken('0xa86a.avax', 43114, '0x8475509d391e6ee5A8b7133221CE17019D307B3E', 18, 'hyTB', 'HiYield Treasury Bill'),
    new XToken('0xa86a.avax', 43114, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 6, 'USDC', 'USD Coin'),
    new XToken('0xa86a.avax', 43114, '0xdBDd50997361522495EcFE57EBb6850dA0E4C699', 18, 'bnUSD', 'Balanced Dollar'),
    new XToken('0xa86a.avax', 43114, '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', 6, 'USDT', 'Tether USD'),
    new XToken('0xa86a.avax', 43114, '0xC7FE3f5B4970Ddc36d850A98e87bb28FaBb866D2', 18, 'sICX', 'Staked ICX'),
    new XToken('0xa86a.avax', 43114, '0x542245f2B93B30994a4670121541B38226f1208c', 18, 'BALN', 'Balance Token'),
  ],
  '0x38.bsc': [
    new XToken('0x38.bsc', 56, '0x0000000000000000000000000000000000000000', 18, 'BNB', 'BNB'),
    new XToken('0x38.bsc', 56, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'ETH', 'Ethereum'),
    new XToken('0x38.bsc', 56, '0xc65132325bD4FcF2Ec5F3a9375487163B6999206', 18, 'bnUSD', 'Balanced Dollar'),
    new XToken(
      '0x38.bsc',
      56,
      '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      18,
      'BTC',
      'Binance-Peg BTCB Token',
      'BTC1',
      'BTCB',
    ),
    new XToken('0x38.bsc', 56, '0xd94F0Aea6d6f14C012d992e8886C8C1736921e10', 18, 'sICX', 'Staked ICX'),
    new XToken('0x38.bsc', 56, '0x94cf269d63c4140eD481CB0b149daE03c4620cdF', 18, 'BALN', 'Balance Token'),
  ],
  '0xa4b1.arbitrum': [
    new XToken('0xa4b1.arbitrum', 42161, '0x0000000000000000000000000000000000000000', 18, 'ETH', 'ETH'),
    new XToken('0xa4b1.arbitrum', 42161, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
    new XToken('0xa4b1.arbitrum', 42161, '0xA67f4b09Eed22f8201Ee0637CbE9d654E63F946e', 18, 'bnUSD', 'Balanced Dollar'),
    new XToken('0xa4b1.arbitrum', 42161, '0x35751007a407ca6feffe80b3cb397736d2cf4dbe', 18, 'weETH', 'Wrapped eETH'),
    new XToken('0xa4b1.arbitrum', 42161, '0x5979D7b546E38E414F7E9822514be443A4800529', 18, 'wstETH', 'Wrapped stETH'),
    new XToken('0xa4b1.arbitrum', 42161, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 6, 'USDC', 'USD Coin'),
    new XToken(
      '0xa4b1.arbitrum',
      42161,
      '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
      8,
      'BTC',
      'Wrapped BTC',
      'BTC1',
      'wBTC',
    ),
    new XToken('0xa4b1.arbitrum', 42161, '0x6c84a8f1c29108F47a79964b5Fe888D4f4D0dE40', 18, 'tBTC', 'Threshold BTC'),
    new XToken('0xa4b1.arbitrum', 42161, '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 6, 'USDT', 'Tether USD'),
    new XToken('0xa4b1.arbitrum', 42161, '0xD336c74B840f9962cF2c666f8666d6d61Ec24440', 18, 'sICX', 'Staked ICX'),
    new XToken('0xa4b1.arbitrum', 42161, '0xac7952D30850c9d214b0f44cbe213781b4dAcF05', 18, 'BALN', 'Balance Token'),
  ],
  '0xa.optimism': [
    new XToken('0xa.optimism', 10, '0x0000000000000000000000000000000000000000', 18, 'ETH', 'ETH'),
    new XToken('0xa.optimism', 10, '0xdccd213951d8214fbaca720728474e2cef9d247b', 18, 'bnUSD', 'Balanced Dollar'),
    new XToken('0xa.optimism', 10, '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', 6, 'USDC', 'USD Coin'),
    new XToken('0xa.optimism', 10, '0x91b36B5b078A3150EA05d5451b3feB608CFcEEE1', 18, 'sICX', 'Staked ICX'),
    new XToken('0xa.optimism', 10, '0xD336c74B840f9962cF2c666f8666d6d61Ec24440', 18, 'BALN', 'Balance Token'),
  ],
  '0x2105.base': [
    new XToken('0x2105.base', 8453, '0x0000000000000000000000000000000000000000', 18, 'ETH', 'ETH'),
    new XToken('0x2105.base', 8453, '0x78b7CD9308287DEb724527d8703c889e2d6C3708', 18, 'bnUSD', 'Balanced Dollar'),
    new XToken('0x2105.base', 8453, '0x04C0599Ae5A44757c0af6F9eC3b93da8976c150A', 18, 'weETH', 'Wrapped eETH'),
    new XToken('0x2105.base', 8453, '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452', 18, 'wstETH', 'Wrapped stETH'),
    new XToken(
      '0x2105.base',
      8453,
      '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
      8,
      'BTC',
      'Coinbase Wrapped BTC',
      'BTC1',
      'cbBTC',
    ),
    new XToken('0x2105.base', 8453, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6, 'USDC', 'USD Coin'),
    new XToken('0x2105.base', 8453, '0xd94F0Aea6d6f14C012d992e8886C8C1736921e10', 18, 'sICX', 'Staked ICX'),
    new XToken('0x2105.base', 8453, '0x76e118fa6839ddAd531411B8cc7a9dCdFD7D4fB0', 18, 'BALN', 'Balance Token'),
  ],
  '0x100.icon': [
    new XToken('0x100.icon', 0x100, 'hx0000000000000000000000000000000000000000', 18, 'HVH', 'HVH'),
    new XToken('0x100.icon', 0x100, 'cx4b40466250f9ccf04cc92da1b6633968ba3ec7cc', 18, 'bnUSD', 'Balanced Dollar'),
  ],
  '0x2.icon': [],
  '0xa869.fuji': [],
  archway: [],
  'injective-1': [
    new XToken('injective-1', 'injective-1', 'inj', 18, 'INJ', 'INJ'),
    new XToken(
      'injective-1',
      'injective-1',
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1qspaxnztkkzahvp6scq6xfpgafejmj2td83r9j',
      18,
      'bnUSD',
      'Balanced Dollar',
    ),
    new XToken(
      'injective-1',
      'injective-1',
      'ibc/2CBC2EA121AE42563B08028466F37B600F2D7D4282342DE938283CC3FB2BC00E',
      6,
      'USDC',
      'USD Coin',
    ),
    new XToken(
      'injective-1',
      'injective-1',
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1lhv6q3w9akshmrrnw3vzuvcteh9ca8xwpwlfy3',
      18,
      'sICX',
      'Staked ICX',
    ),
    new XToken(
      'injective-1',
      'injective-1',
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj10207z3hn49q2w59tl8e3ctwhet7wqg9neey0nj',
      18,
      'BALN',
      'Balance Token',
    ),
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
  sui: [
    new XToken(
      'sui',
      'sui',
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
      9,
      'SUI',
      'SUI',
    ),
    new XToken(
      'sui',
      'sui',
      '0x549e8b69270defbfafd4f94e17ec44cdbdd99820b33bda2278dea3b9a32d3f55::cert::CERT',
      9,
      'vSUI',
      'Volo Staked SUI',
    ),
    new XToken(
      'sui',
      'sui',
      '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI',
      9,
      'haSUI',
      'Haedal Staked SUI',
    ),
    new XToken(
      'sui',
      'sui',
      '0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI',
      9,
      'afSUI',
      'Aftermath Staked SUI',
    ),
    new XToken(
      'sui',
      'sui',
      '0x922d15d7f55c13fd790f6e54397470ec592caa2b508df292a2e8553f3d3b274f::msui::MSUI',
      9,
      'mSUI',
      'Mirai Staked SUI',
    ),
    new XToken(
      'sui',
      'sui',
      '0x3917a812fe4a6d6bc779c5ab53f8a80ba741f8af04121193fc44e0f662e2ceb::balanced_dollar::BALANCED_DOLLAR',
      9,
      'bnUSD',
      'Balanced Dollar',
    ),
    new XToken(
      'sui',
      'sui',
      '0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC',
      6,
      'USDC',
      'USD Coin',
    ),
    new XToken(
      'sui',
      'sui',
      '0x84bf1838f4fb91b22fe12af02658c27f53f89c36f2ea6c8b6a878f0e48ec1b4e::sicx::SICX',
      9,
      'sICX',
      'Staked ICX',
    ),
    new XToken(
      'sui',
      'sui',
      '0x3ae6be8e58c0e0715764971b750709e67c6de33e38bbecafe25b5f3dd5080a39::balanced_token::BALANCED_TOKEN',
      9,
      'BALN',
      'Balance Token',
    ),
  ],
  solana: [
    new XToken('solana', 'solana', '11111111111111111111111111111111', 9, 'SOL', 'SOL'),
    new XToken('solana', 'solana', '2yN29zk8jgRTW7GUF9WwYAEz8vvABVnvbfQc5DpGi9CJ', 9, 'bnUSD', 'Balanced Dollar'),
    new XToken('solana', 'solana', 'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn', 9, 'JitoSOL', 'Jito Staked SOL'),
    new XToken('solana', 'solana', '5N43m6JGxrZ6fW7MrwdbjgY93yjCj7krkcaTA7oRknj6', 9, 'sICX', 'Staked ICX'),
    new XToken('solana', 'solana', 'BH4TZqN9TXnkjiLEQZ9xuXo85YaGoonM4PHpcjHEoTAx', 9, 'BALN', 'Balance Token'),
    new XToken('solana', 'solana', 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', 6, 'USDC', 'USD Coin'),
  ],
};

type XTokenMapBySymbol = {
  [key in XChainId]: {
    [symbol: string]: XToken;
  };
};

export const xTokenMapBySymbol: XTokenMapBySymbol = Object.fromEntries(
  Object.entries(xTokenMap).map(([chainId, tokens]) => [
    chainId,
    tokens.reduce(
      (acc, token) => {
        acc[token.symbol] = token;
        return acc;
      },
      {} as { [symbol: string]: XToken },
    ),
  ]),
) as XTokenMapBySymbol;

export const allXTokens = Object.values(xTokenMap).reduce((acc, xTokens) => {
  return acc.concat(xTokens);
}, []);

export const sARCHOnArchway = {
  ['archway-1']: new XToken(
    'archway-1',
    'archway-1',
    'archway1t2llqsvwwunf98v692nqd5juudcmmlu3zk55utx7xtfvznel030saclvq6',
    18,
    'sARCH',
    'Staked Archway',
  ),
  ['archway']: new XToken(
    'archway',
    'archway',
    'archway1erqguqc3hmfajgu7e2dvgaccx6feu5ru3gyatdxu94p66j9hp7msn2kcqp',
    18,
    'sARCH',
    'Staked Archway',
  ),
};
