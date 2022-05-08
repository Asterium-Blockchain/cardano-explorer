import axios from 'axios';
import { SetState } from 'zustand';
import { AppState } from './useStore';

export interface AdaPriceSlice {
  fetchAdaPrice: () => Promise<void>;
  change24hs: number | null;
  volume24hs: number | null;
  adaPrice: string | null;
}

const createAdaPriceSlice = (set: SetState<AppState>) => ({
  adaPrice: null,
  change24hs: null,
  volume24hs: null,
  interval: null,
  fetchAdaPrice: async () => {
    const { data } = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'cardano',
          vs_currencies: 'usd',
          include_24hr_vol: true,
          include_24hr_change: true,
          include_last_updated_at: true,
        },
      },
    );
    set((state) => ({
      ...state,
      adaPrice: data.cardano.usd,
      change24hs: data.cardano.usd_24h_change,
      volume24hs: data.cardano.usd_24h_vol,
    }));
  },
});

export default createAdaPriceSlice;
