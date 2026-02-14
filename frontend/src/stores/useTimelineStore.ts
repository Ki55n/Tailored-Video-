import { create } from 'zustand';

export interface TimelineSegment {
    id: string;
    start: number;
    end: number;
    title: string;
    type: 'video' | 'audio' | 'ai';
    track: string;
    color?: string;
    label?: string;
}

interface TimelineState {
    segments: TimelineSegment[];
    playheadPosition: number;
    isMagnetEnabled: boolean;
    zoomLevel: number;
    duration: number;

    setSegments: (segments: TimelineSegment[]) => void;
    updateSegment: (id: string, updates: Partial<TimelineSegment>) => void;
    snapSegment: (id: string, newStart: number) => void;
    toggleMagnet: () => void;
    setPlayhead: (pos: number) => void;
    setZoomLevel: (level: number) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
    segments: [
        { id: 'ai-1', start: 5, end: 25, title: 'Auto-Cut Sequence', type: 'ai', track: 'ai', color: '#007AFF' },
        { id: 'ai-2', start: 30, end: 40, title: 'Denoise', type: 'ai', track: 'ai', color: '#FF9500' },
        { id: 'ai-3', start: 50, end: 75, title: 'Smart Transitions', type: 'ai', track: 'ai', color: '#007AFF' },
        { id: 'v-1', start: 0, end: 18, title: 'Clip_001.mp4', type: 'video', track: 'video1' },
        { id: 'v-2', start: 18, end: 32, title: 'Landscape_Hero_Edit', type: 'video', track: 'video1', label: '✦ UPSCALED' },
        { id: 'v-3', start: 38, end: 55, title: 'Landscape_Hero_Edit', type: 'video', track: 'video1' },
        { id: 'v-4', start: 55, end: 80, title: 'Night_DroL04.mov', type: 'video', track: 'video1' },
        { id: 'a-1', start: 0, end: 28, title: 'Soundtrack_Main_v2.wav', type: 'audio', track: 'audio1' },
        { id: 'a-2', start: 45, end: 80, title: 'Ambient_Nature_Loop', type: 'audio', track: 'audio1' },
    ],
    playheadPosition: 42,
    isMagnetEnabled: true,
    zoomLevel: 1,
    duration: 95,

    setSegments: (segments) => set({ segments }),

    updateSegment: (id, updates) =>
        set((state) => ({
            segments: state.segments.map((s) =>
                s.id === id ? { ...s, ...updates } : s
            ),
        })),

    snapSegment: (id, newStart) =>
        set((state) => {
            if (!state.isMagnetEnabled) {
                return {
                    segments: state.segments.map((s) =>
                        s.id === id ? { ...s, start: newStart } : s
                    ),
                };
            }
            const threshold = 0.5;
            let finalStart = newStart;
            state.segments.forEach((s) => {
                if (s.id !== id && Math.abs(s.end - newStart) < threshold) {
                    finalStart = s.end;
                }
            });
            return {
                segments: state.segments.map((s) =>
                    s.id === id ? { ...s, start: finalStart } : s
                ),
            };
        }),

    toggleMagnet: () => set((state) => ({ isMagnetEnabled: !state.isMagnetEnabled })),
    setPlayhead: (pos) => set({ playheadPosition: pos }),
    setZoomLevel: (level) => set({ zoomLevel: level }),
}));
