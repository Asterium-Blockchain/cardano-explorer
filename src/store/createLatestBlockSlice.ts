import { SetState } from 'zustand';

import { AppState } from './useStore';
import { LatestBlockResponse } from '@/pages/api/blocks/latest';
import axios from '@/utils/axios';

export type LatestBlockSlice = {
  latestBlock: null | LatestBlockResponse['latestBlock'];
  fetchLatestBlock: () => Promise<void>;
};

const createLatestBlockSlice = (set: SetState<AppState>) => ({
  latestBlock: null,

  fetchLatestBlock: async () => {
    const { data } = await axios.get<LatestBlockResponse>('blocks/latest');
    console.log(data);
    set((state) => ({ ...state, latestBlock: data.latestBlock }));
  },
});

export default createLatestBlockSlice;
