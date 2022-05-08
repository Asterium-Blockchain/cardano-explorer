import axios from 'axios';
import { SetState } from 'zustand';
import { AppState } from './useStore';

export interface BlockchainLoadSlice {
  fetchBlockchainLoad: () => Promise<void>;
  blockchainLoad: number | null;
}

const createBlockchainLoadSlice = (set: SetState<AppState>) => ({
  blockchainLoad: null,
  fetchBlockchainLoad: async () => {
    const { data } = await axios.get('https://pool.pm/total.json');

    set((state) => ({
      ...state,
      blockchainLoad: data.load_5m,
    }));
  },
});

export default createBlockchainLoadSlice;
