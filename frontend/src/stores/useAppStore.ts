import { create } from 'zustand';

export interface AppSettings {
    fullName: string;
    email: string;
    autoCaptions: boolean;
    defaultResolution: string;
    aiProcessingPower: number;
}

interface AppState {
    loadingPhase: number;
    loadingStage: string;
    isLoaded: boolean;
    currentProject: string;
    settings: AppSettings;

    setLoadingPhase: (phase: number, stage: string) => void;
    setIsLoaded: (loaded: boolean) => void;
    setCurrentProject: (name: string) => void;
    updateSettings: (updates: Partial<AppSettings>) => void;
}

export const useAppStore = create<AppState>((set) => ({
    loadingPhase: 0,
    loadingStage: 'INITIALIZING STORES...',
    isLoaded: false,
    currentProject: 'CINEMATIC_SEQUENCE_01',
    settings: {
        fullName: 'Alex River',
        email: 'alex.river@example.com',
        autoCaptions: true,
        defaultResolution: '4K Ultra HD (3840 × 2160)',
        aiProcessingPower: 80,
    },

    setLoadingPhase: (phase, stage) => set({ loadingPhase: phase, loadingStage: stage }),
    setIsLoaded: (loaded) => set({ isLoaded: loaded }),
    setCurrentProject: (name) => set({ currentProject: name }),
    updateSettings: (updates) =>
        set((state) => ({
            settings: { ...state.settings, ...updates },
        })),
}));
