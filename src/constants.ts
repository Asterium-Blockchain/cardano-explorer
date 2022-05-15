import { WalletName } from './store/createWalletSlice';

export const ADA_HANDLE_POLICY_ID =
  'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';

export const ADA_PRICE_FETCH_INTERVAL = 5000;
export const LATEST_BLOCK_FETCH_INTERVAL = 10000;
export const BLOCKCHAIN_LOAD_FETCH_INTERVAL = 20000;

export const SUPPORTED_WALLETS: WalletName[] = [
  'nami',
  'eternl',
  'flint',
  // 'gero',
];

export const EPOCH_DURATION = 432000;
