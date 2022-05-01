import axios from 'axios';
import { SetState } from 'zustand';
import { AppState } from './useStore';

export interface AdaPriceSlice {
  fetchAdaPrice: () => Promise<void>;
  adaPrice: string | null;
  isLoadingAdaPrice: boolean;
}

const createAdaPriceSlice = (set: SetState<AppState>) => ({
  adaPrice: null,
  isLoadingAdaPrice: false,
  fetchAdaPrice: async () => {
    set((state) => ({ ...state, isLoadingAdaPrice: true }));
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd',
    );
    set((state) => ({
      ...state,
      adaPrice: data.cardano.usd,
      isLoadingAdaPrice: false,
    }));
  },
});

export default createAdaPriceSlice;
