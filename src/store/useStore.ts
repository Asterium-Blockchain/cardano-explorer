import create from 'zustand';
import createAdaPriceSlice, { AdaPriceSlice } from './createAdaPriceSlice';
import createSearchSlice, { SearchSlice } from './createSearchSlice';

export type AppState = SearchSlice & AdaPriceSlice;

const useStore = create<AppState>((set, get) => ({
  ...createSearchSlice(set, get),
  ...createAdaPriceSlice(set),
}));

export default useStore;
