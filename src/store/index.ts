import { create } from 'zustand';
import { SearchParams } from '@/types/ndex';

interface NetworkStore {
  searchParams: SearchParams;
  selectedNetworks: string[];
  selectedNetworkId: string | null;
  viewMode: 'list' | 'grid';
  selectionMode: boolean;
  setSearchParams: (params: Partial<SearchParams>) => void;
  setSelectedNetworks: (networkIds: string[]) => void;
  toggleNetworkSelection: (networkId: string) => void;
  setViewMode: (mode: 'list' | 'grid') => void;
  setSelectedNetworkId: (networkId: string | null) => void;
  setSelectionMode: (enabled: boolean) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  searchParams: {
    start: 0,
    size: 25,
    searchString: '',
  },
  selectedNetworks: [],
  viewMode: 'list',
  selectedNetworkId: null,
  selectionMode: false,

  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  setSelectedNetworks: (networkIds) =>
    set(() => ({
      selectedNetworks: networkIds,
    })),

  toggleNetworkSelection: (networkId) =>
    set((state) => ({
      selectedNetworks: state.selectedNetworks.includes(networkId)
        ? state.selectedNetworks.filter((id) => id !== networkId)
        : [...state.selectedNetworks, networkId],
    })),

  setViewMode: (mode) =>
    set(() => ({
      viewMode: mode,
    })),

  setSelectedNetworkId: (networkId) =>
    set(() => ({
      selectedNetworkId: networkId,
    })),

  setSelectionMode: (enabled) =>
    set(() => ({
      selectionMode: enabled,
      // Clear selections when disabling selection mode
      selectedNetworks: enabled ? [] : [],
    })),
}));
