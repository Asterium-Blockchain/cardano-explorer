import create from 'zustand';

import createAdaPriceSlice, { AdaPriceSlice } from './createAdaPriceSlice';
import createAddressTransactionsSlice, {
  AddressTransactionsSlice,
} from './createAddressTransactionsSlice';
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
  BlockchainLoadSlice &
  AddressTransactionsSlice;

const useStore = create<AppState>((set, get) => ({
  ...createSearchSlice(set, get),
  ...createAdaPriceSlice(set),
  ...createLatestBlockSlice(set),
  ...createBlockchainLoadSlice(set),
  ...createAddressTransactionsSlice(set, get),
}));

export default useStore;
