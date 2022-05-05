import create from 'zustand';
import createAdaPriceSlice, { AdaPriceSlice } from './createAdaPriceSlice';
import createLatestBlockSlice, {
  LatestBlockSlice,
} from './createLatestBlockSlice';
import createSearchSlice, { SearchSlice } from './createSearchSlice';

export type AppState = SearchSlice & AdaPriceSlice & LatestBlockSlice;

const useStore = create<AppState>((set, get) => ({
  ...createSearchSlice(set, get),
  ...createAdaPriceSlice(set),
  ...createLatestBlockSlice(set),
}));

export default useStore;
