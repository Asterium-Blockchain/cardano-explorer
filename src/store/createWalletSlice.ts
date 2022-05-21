import { Amount, CardanoApi } from '@/types';
import { valueToAssets } from '@/utils/blockchain/assetClasses';
import { C, fromHex } from 'lucid-cardano';
import { SetState } from 'zustand';
import { AppState } from './useStore';

export type WalletName = 'eternl' | 'nami' | 'flint';

export interface WalletSlice {
  api: CardanoApi | null;
  address: string | null;
  walletLoading: null | WalletName;
  walletName: WalletName | null;
  balance: Amount | null;
  connectWallet: (walletName: WalletName) => Promise<void>;
}

const createWalletSlice = (set: SetState<AppState>) => ({
  api: null,
  address: null,
  walletLoading: null,
  walletName: null,
  balance: null,
  connectWallet: async (walletName: WalletName) => {
    set((state) => ({ ...state, walletLoading: walletName }));
    try {
      const api: CardanoApi = await (window as any).cardano[
        walletName
      ]?.enable();
      const firstAddress = await api.getChangeAddress();
      const encodedBalance = await api.getBalance();

      set((state) => ({
        ...state,
        api,
        walletLoading: null,
        walletName,
        balance: valueToAssets(encodedBalance),
        address: C.Address.from_bytes(fromHex(firstAddress)).to_bech32(),
      }));

      localStorage.setItem('asterium-wallet-name', walletName);
    } catch (error) {
      set((state) => ({ ...state, walletLoading: null }));
    }
  },
});

export default createWalletSlice;
