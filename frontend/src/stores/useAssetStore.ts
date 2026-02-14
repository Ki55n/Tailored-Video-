import { create } from 'zustand';

export interface Asset {
    id: string;
    name: string;
    type: 'video' | 'audio' | 'image';
    duration: string;
    size: string;
    resolution: string;
    dateAdded: string;
    thumbnail?: string;
}

type FilterType = 'all' | 'video' | 'audio' | 'image';

interface AssetState {
    assets: Asset[];
    filter: FilterType;
    selectedIds: string[];
    searchQuery: string;

    setFilter: (filter: FilterType) => void;
    toggleSelect: (id: string) => void;
    selectAll: () => void;
    clearSelection: () => void;
    deleteSelected: () => void;
    setSearchQuery: (query: string) => void;
    filteredAssets: () => Asset[];
}

const mockAssets: Asset[] = [
    { id: '1', name: 'Interview_01.mp4', type: 'video', duration: '04:22', size: '1.2 GB', resolution: '4K', dateAdded: 'Oct 24, 2023' },
    { id: '2', name: 'Background_Music.wav', type: 'audio', duration: '03:15', size: '45 MB', resolution: '—', dateAdded: 'Oct 23, 2023' },
    { id: '3', name: 'B-Roll_City_Sunset.mov', type: 'video', duration: '00:15', size: '850 MB', resolution: '1080p', dateAdded: 'Oct 22, 2023' },
    { id: '4', name: 'Logo_Final.png', type: 'image', duration: '—', size: '2.4 MB', resolution: '2000×2000', dateAdded: 'Oct 21, 2023' },
    { id: '5', name: 'Drone_Shot_05.mp4', type: 'video', duration: '01:10', size: '2.1 GB', resolution: '4K', dateAdded: 'Oct 20, 2023' },
];

export const useAssetStore = create<AssetState>((set, get) => ({
    assets: mockAssets,
    filter: 'all',
    selectedIds: [],
    searchQuery: '',

    setFilter: (filter) => set({ filter }),
    toggleSelect: (id) =>
        set((state) => ({
            selectedIds: state.selectedIds.includes(id)
                ? state.selectedIds.filter((i) => i !== id)
                : [...state.selectedIds, id],
        })),
    selectAll: () =>
        set((state) => ({
            selectedIds: get().filteredAssets().map((a) => a.id),
        })),
    clearSelection: () => set({ selectedIds: [] }),
    deleteSelected: () =>
        set((state) => ({
            assets: state.assets.filter((a) => !state.selectedIds.includes(a.id)),
            selectedIds: [],
        })),
    setSearchQuery: (query) => set({ searchQuery: query }),
    filteredAssets: () => {
        const state = get();
        let result = state.assets;
        if (state.filter !== 'all') {
            result = result.filter((a) => a.type === state.filter);
        }
        if (state.searchQuery) {
            result = result.filter((a) =>
                a.name.toLowerCase().includes(state.searchQuery.toLowerCase())
            );
        }
        return result;
    },
}));
