import { CardanoApi } from '@/types';
import { fromHex } from 'lucid-cardano';
import { SetState } from 'zustand';
import { AppState } from './useStore';

export type WalletName = 'eternl' | 'nami' | 'flint';

export interface WalletSlice {
  api: CardanoApi | null;
  address: string | null;
  walletLoading: null | WalletName;
  walletName: WalletName | null;
  connectWallet: (walletName: WalletName) => Promise<void>;
}

const createWalletSlice = (set: SetState<AppState>) => ({
  api: null,
  address: null,
  walletLoading: null,
  walletName: null,
  connectWallet: async (walletName: WalletName) => {
    set((state) => ({ ...state, walletLoading: walletName }));
    try {
      const api: CardanoApi = await (window as any).cardano[
        walletName
      ]?.enable();
      const firstAddress = await api.getChangeAddress();
      const { C } = await import('lucid-cardano');

      set((state) => ({
        ...state,
        api,
        walletLoading: null,
        walletName,
        address: C.Address.from_bytes(fromHex(firstAddress)).to_bech32(),
      }));

      localStorage.setItem('asterium-wallet-name', walletName);
    } catch (error) {
      set((state) => ({ ...state, walletLoading: null }));
    }
  },
});

export default createWalletSlice;
