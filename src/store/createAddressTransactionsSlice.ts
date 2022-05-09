import { AddressTransactionsResponse } from '@/pages/api/addresses/[address]/transactions';
import axios from '@/utils/axios';
import { GetState, SetState } from 'zustand';
import { AppState } from './useStore';

export interface AddressTransactionsSlice {
  addressTransactions: AddressTransactionsResponse['transactions'];
  addressTransactionsPage: number;
  isLoadingFetchMoreAddressTransactions: boolean;
  fetchMoreAddressTransactions: (address: string) => Promise<void>;
}

const createAddressTransactionsSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>,
) => ({
  addressTransactions: [],
  addressTransactionsPage: 0,
  isLoadingFetchMoreAddressTransactions: false,

  fetchMoreAddressTransactions: async (address: string) => {
    set(() => ({ isLoadingFetchMoreAddressTransactions: true }));

    const { data } = await axios.get<AddressTransactionsResponse>(
      `addresses/${address}/transactions`,
      {
        params: {
          page: get().addressTransactionsPage + 1,
        },
      },
    );
    set((state) => ({
      ...state,
      addressTransactions: [...state.addressTransactions, ...data.transactions],
      addressTransactionsPage: state.addressTransactionsPage + 1,
      isLoadingFetchMoreAddressTransactions: false,
    }));
  },
});

export default createAddressTransactionsSlice;
