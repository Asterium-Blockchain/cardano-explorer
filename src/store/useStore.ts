import create from 'zustand';

import createAdaPriceSlice, { AdaPriceSlice } from './createAdaPriceSlice';
import createBlockchainLoadSlice, {
  BlockchainLoadSlice,
} from './createBlockchainLoadSlice';
import createLatestBlockSlice, {
  LatestBlockSlice,
} from './createLatestBlockSlice';
import createSearchSlice, { SearchSlice } from './createSearchSlice';

export type AppState = SearchSlice &
  AdaPriceSlice &
  LatestBlockSlice &
  BlockchainLoadSlice;

const useStore = create<AppState>((set, get) => ({
  ...createSearchSlice(set, get),
  ...createAdaPriceSlice(set),
  ...createLatestBlockSlice(set),
  ...createBlockchainLoadSlice(set),
}));

export default useStore;
