import blockfrost from '@lib/blockfrost';
import browserBlockfrost from '@/utils/browserBlockfrost';
import { SetState } from 'zustand';
import { AppState } from './useStore';

export interface ProtocolParamsSlice {
  protocolParams: Awaited<
    ReturnType<typeof blockfrost.epochsParameters>
  > | null;
  fetchProtocolParams: () => Promise<void>;
}

const createProtocolParamsSlice = (set: SetState<AppState>) => ({
  protocolParams: null,
  fetchProtocolParams: async () => {
    const { data } = await browserBlockfrost.get('epochs/latest/parameters');
    set((state) => ({ ...state, protocolParams: data }));
  },
});

export default createProtocolParamsSlice;
