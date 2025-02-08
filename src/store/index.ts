import { create } from 'zustand';
import { SearchParams, NetworkSummary, User } from '@/types/ndex';

interface UserStore {
  searchParams: SearchParams;
  selectedUser: User | null;
  setSearchParams: (params: Partial<SearchParams>) => void;
  setSelectedUser: (user: User | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  searchParams: {
    start: 0,
    size: 25,
    searchString: '*',  // Use wildcard to get all users by default
  },
  selectedUser: null,

  setSearchParams: (params) =>
    set((state) => ({
      searchParams: { ...state.searchParams, ...params },
    })),

  setSelectedUser: (user) =>
    set(() => ({
      selectedUser: user,
    })),
}));

interface NetworkStore {
  searchParams: SearchParams;
  selectedNetworks: string[];
  selectedNetworkId: string | null;
  selectedNetwork: NetworkSummary | null;
  viewMode: 'list' | 'grid';
  selectionMode: boolean;
  setSearchParams: (params: Partial<SearchParams>) => void;
  setSelectedNetworks: (networkIds: string[]) => void;
  toggleNetworkSelection: (networkId: string) => void;
  setViewMode: (mode: 'list' | 'grid') => void;
  setSelectedNetwork: (network: NetworkSummary | null) => void;
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
  selectedNetwork: null,
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

  setSelectedNetwork: (network) =>
    set(() => ({
      selectedNetworkId: network?.externalId || null,
      selectedNetwork: network,
    })),

  setSelectionMode: (enabled) =>
    set(() => ({
      selectionMode: enabled,
      // Clear selections when disabling selection mode
      selectedNetworks: enabled ? [] : [],
    })),
}));
