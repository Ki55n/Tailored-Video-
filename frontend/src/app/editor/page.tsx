'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Pause, Volume2, Maximize2, Undo2, Redo2,
    Share2, Scissors, Copy, Magnet, ChevronDown,
    Sparkles, Eye, Trash2, Search
} from 'lucide-react';
import Button from '@/components/atoms/Button';
import Toggle from '@/components/atoms/Toggle';
import Slider from '@/components/atoms/Slider';
import { useTimelineStore } from '@/stores/useTimelineStore';

export default function EditorPage() {
    const {
        segments, playheadPosition, isMagnetEnabled, zoomLevel,
        toggleMagnet, setZoomLevel, setPlayhead, duration
    } = useTimelineStore();

    const [isPlaying, setIsPlaying] = useState(false);
    const [opacity, setOpacity] = useState(85);
    const [scale, setScale] = useState(100);
    const [bgRemoval, setBgRemoval] = useState(true);
    const [smartUpscale, setSmartUpscale] = useState(false);
    const [eyeContact, setEyeContact] = useState(false);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(seconds % 60).toString().padStart(2, '0');
        const f = Math.floor((seconds % 1) * 24).toString().padStart(2, '0');
        return `${h}:${m}:${s}:${f}`;
    };

    const timeMarkers = Array.from({ length: Math.ceil(duration / 15) + 1 }, (_, i) => {
        const sec = i * 15;
        const m = Math.floor(sec / 60).toString().padStart(2, '0');
        const s = (sec % 60).toString().padStart(2, '0');
        return { pos: sec, label: `${m}:${s}` };
    });

    const getSegmentStyle = (seg: typeof segments[0]) => {
        const left = (seg.start / duration) * 100;
        const width = ((seg.end - seg.start) / duration) * 100;
        return { left: `${left}%`, width: `${width}%` };
    };

    const playheadLeft = (playheadPosition / duration) * 100;

    return (
        <div className="flex flex-col h-screen">
            {/* Top Bar */}
            <header className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border-dim">
                <div className="flex items-center gap-3">
                    <h1 className="text-sm font-bold tracking-wider text-white">
                        TAILORED <span className="font-black">VIDEO</span>
                    </h1>
                    <span className="text-xs text-muted flex items-center gap-1">
                        PROJECT: <span className="text-white font-medium">CINEMATIC_SEQUENCE_01</span>
                        <ChevronDown className="w-3 h-3" />
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-muted hover:text-white p-1.5 cursor-pointer"><Undo2 className="w-4 h-4" /></button>
                    <button className="text-muted hover:text-white p-1.5 cursor-pointer"><Redo2 className="w-4 h-4" /></button>
                    <Button variant="secondary" size="sm" icon={<Share2 className="w-3.5 h-3.5" />}>Share</Button>
                    <Button size="sm">EXPORT</Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Video Preview Area */}
                <div className="flex-1 flex flex-col bg-void-black">
                    {/* Preview */}
                    <div className="flex-1 relative flex items-center justify-center p-4">
                        <div className="relative w-full max-w-3xl aspect-video bg-deep-slate rounded-lg overflow-hidden border border-border-dim">
                            {/* Mock Video Frame */}
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                    backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&h=500&fit=crop')"
                                }}
                            />
                            {/* Resolution Badge */}
                            <div className="absolute top-3 right-3 text-[10px] text-muted bg-black/60 px-2 py-1 rounded">
                                4K • 23.976 fps
                            </div>
                            {/* Play Button */}
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-16 h-16 bg-electric-blue rounded-full flex items-center justify-center shadow-lg shadow-electric-blue/30"
                                >
                                    {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
                                </motion.div>
                            </button>
                        </div>
                    </div>

                    {/* Playback Controls */}
                    <div className="flex items-center justify-between px-6 py-2 bg-surface/50">
                        <span className="text-xs font-mono text-danger">{formatTime(playheadPosition)}</span>
                        <div className="flex items-center gap-4">
                            <button className="text-muted hover:text-white cursor-pointer"><Volume2 className="w-4 h-4" /></button>
                            <button className="text-muted hover:text-white cursor-pointer"><Maximize2 className="w-4 h-4" /></button>
                        </div>
                        <span className="text-xs font-mono text-muted">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Properties Panel */}
                <aside className="w-72 bg-surface border-l border-border-dim overflow-y-auto">
                    <div className="p-4 border-b border-border-dim">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Properties</h3>
                            <button className="text-muted hover:text-white cursor-pointer">⋮</button>
                        </div>
                    </div>

                    {/* Transform */}
                    <div className="p-4 border-b border-border-dim">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-white">Transform</h4>
                            <ChevronDown className="w-4 h-4 text-muted" />
                        </div>
                        <div className="space-y-5">
                            <Slider label="OPACITY" value={opacity} onChange={setOpacity} displayValue={`${opacity}%`} />
                            <Slider label="SCALE" value={scale} onChange={setScale} displayValue={`${scale}%`} />
                        </div>
                    </div>

                    {/* AI Enhancements */}
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-electric-blue" />
                            <h4 className="text-sm font-semibold text-white">AI Enhancements</h4>
                        </div>
                        <div className="space-y-1">
                            <Toggle label="Background Removal" enabled={bgRemoval} onChange={setBgRemoval} />
                            <Toggle label="Smart Upscaling" enabled={smartUpscale} onChange={setSmartUpscale} />
                            <Toggle label="Eye Contact Fix" enabled={eyeContact} onChange={setEyeContact} />
                        </div>
                    </div>
                </aside>
            </div>

            {/* AI Command Bar */}
            <div className="flex items-center gap-2 px-4 py-2 bg-surface border-t border-border-dim">
                <Button variant="primary" size="sm" icon={<Sparkles className="w-3.5 h-3.5" />}>
                    AI COMMAND
                </Button>
                <div className="flex-1 relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                        placeholder="Edit timeline with AI... (e.g. 'Cut silences' or 'Apply cinematic grade to all clips')"
                        className="w-full bg-deep-slate border border-border-dim rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-muted focus:outline-none focus:border-electric-blue"
                    />
                </div>
                <div className="flex items-center gap-2 ml-2">
                    <button className="text-muted hover:text-white p-1.5 cursor-pointer"><Scissors className="w-4 h-4" /></button>
                    <button className="text-muted hover:text-white p-1.5 cursor-pointer"><Copy className="w-4 h-4" /></button>
                    <button
                        onClick={toggleMagnet}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold cursor-pointer transition-colors ${isMagnetEnabled ? 'text-electric-blue bg-electric-blue/10' : 'text-muted'
                            }`}
                    >
                        <Magnet className="w-4 h-4" />
                        MAGNET
                    </button>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-surface border-t border-border-dim">
                {/* Time ruler */}
                <div className="relative h-6 border-b border-border-dim ml-36">
                    {timeMarkers.map((marker) => (
                        <span
                            key={marker.pos}
                            className="absolute text-[10px] text-muted top-1"
                            style={{ left: `${(marker.pos / duration) * 100}%` }}
                        >
                            {marker.label}
                        </span>
                    ))}
                    {/* Playhead */}
                    <div
                        className="absolute top-0 w-[2px] h-full bg-danger z-10"
                        style={{ left: `${playheadLeft}%` }}
                    >
                        <div className="absolute -top-0.5 -left-1.5 w-[6px] h-[6px] bg-danger rounded-sm rotate-45" />
                    </div>
                </div>

                {/* Track Labels + Tracks */}
                <div className="text-xs">
                    {/* AI Segments Track */}
                    <div className="flex border-b border-border-dim">
                        <div className="w-36 px-3 py-2 flex items-center gap-2 border-r border-border-dim shrink-0">
                            <Sparkles className="w-3.5 h-3.5 text-electric-blue" />
                            <span className="text-electric-blue font-semibold">AI SEGMENTS</span>
                        </div>
                        <div className="flex-1 relative h-10">
                            {segments.filter(s => s.track === 'ai').map(seg => (
                                <motion.div
                                    key={seg.id}
                                    className="absolute top-1 h-8 rounded-md flex items-center justify-center text-[10px] font-medium text-white cursor-grab active:cursor-grabbing border border-white/10"
                                    style={{
                                        ...getSegmentStyle(seg),
                                        backgroundColor: seg.color || '#007AFF',
                                    }}
                                    whileHover={{ y: -1 }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0}
                                >
                                    <span className="truncate px-2">{seg.title}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Video 1 Track */}
                    <div className="flex border-b border-border-dim">
                        <div className="w-36 px-3 py-2 flex items-center gap-2 border-r border-border-dim shrink-0">
                            <span className="text-white font-medium">VIDEO 1</span>
                            <Eye className="w-3 h-3 text-muted ml-auto" />
                            <Trash2 className="w-3 h-3 text-muted" />
                        </div>
                        <div className="flex-1 relative h-12">
                            {segments.filter(s => s.track === 'video1').map(seg => (
                                <motion.div
                                    key={seg.id}
                                    className="absolute top-1.5 h-9 bg-soft-gray rounded-md flex items-center text-[10px] text-white cursor-grab active:cursor-grabbing border border-border-dim overflow-hidden"
                                    style={getSegmentStyle(seg)}
                                    whileHover={{ y: -1 }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0}
                                >
                                    <div className="w-12 h-full bg-deep-slate shrink-0" />
                                    <span className="truncate px-2 font-medium">{seg.title}</span>
                                    {seg.label && (
                                        <span className="text-[8px] text-electric-blue ml-auto mr-2 whitespace-nowrap">{seg.label}</span>
                                    )}
                                </motion.div>
                            ))}
                            {/* Playhead line on video track */}
                            <div
                                className="absolute top-0 w-[2px] h-full bg-danger z-10"
                                style={{ left: `${playheadLeft}%` }}
                            />
                        </div>
                    </div>

                    {/* Audio 1 Track */}
                    <div className="flex border-b border-border-dim">
                        <div className="w-36 px-3 py-2 flex items-center gap-2 border-r border-border-dim shrink-0">
                            <span className="text-white font-medium">AUDIO 1</span>
                            <Volume2 className="w-3 h-3 text-muted ml-auto" />
                            <Trash2 className="w-3 h-3 text-muted" />
                        </div>
                        <div className="flex-1 relative h-10">
                            {segments.filter(s => s.track === 'audio1').map(seg => (
                                <motion.div
                                    key={seg.id}
                                    className="absolute top-1 h-8 bg-success/20 border border-success/30 rounded-md flex items-center text-[10px] text-success font-medium cursor-grab active:cursor-grabbing"
                                    style={getSegmentStyle(seg)}
                                    whileHover={{ y: -1 }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0}
                                >
                                    <span className="truncate px-2">{seg.title}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Timeline Footer */}
                <div className="flex items-center justify-between px-4 py-1.5 text-[10px] text-muted border-t border-border-dim">
                    <div className="flex items-center gap-3">
                        <Search className="w-3 h-3" />
                        <input
                            type="range"
                            min={0.5}
                            max={3}
                            step={0.1}
                            value={zoomLevel}
                            onChange={(e) => setZoomLevel(Number(e.target.value))}
                            className="w-24 accent-electric-blue"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-electric-blue" />
                            Powered by <strong className="text-white">Gemini 3</strong>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-success rounded-full" />
                            Online
                        </span>
                        <span>Auto-save: 2m ago</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
