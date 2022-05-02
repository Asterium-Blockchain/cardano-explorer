import { SearchResponse } from '@/pages/api/search';
import axios from '@/utils/axios';
import React from 'react';
import { GetState, SetState } from 'zustand';
import { AppState } from './useStore';

export interface SearchSlice {
  searchedVal: string;
  element: SearchResponse | undefined;
  isLoadingSearch: boolean;
  showSearchElement: boolean;

  updateSearchVal: (e: React.ChangeEvent<HTMLInputElement>) => void;
  search: () => Promise<void>;
  resetSearch: () => void;
  toggleShowSearchElement: () => void;
}

const createSearchSlice = (
  set: SetState<AppState>,
  get: GetState<AppState>,
) => ({
  element: undefined,
  searchedVal: '',
  isLoadingSearch: false,
  showSearchElement: true,

  updateSearchVal: (e: React.ChangeEvent<HTMLInputElement>) => {
    set((state) => ({ ...state, searchedVal: e.target.value }));
  },
  search: async () => {
    set((state) => ({ ...state, isLoadingSearch: true }));
    const { data } = await axios.get<SearchResponse>('search', {
      params: {
        query: get().searchedVal,
      },
    });
    set((state) => ({
      ...state,
      element: data,
      isLoadingSearch: false,
      showSearchElement: true,
    }));
  },
  resetSearch: () => {
    set((state) => ({ ...state, element: undefined }));
  },
  toggleShowSearchElement: () => {
    set((state) => ({ ...state, showSearchElement: !state.showSearchElement }));
  },
});

export default createSearchSlice;
