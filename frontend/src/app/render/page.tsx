'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Play, Volume2, Maximize2, Download, Share2,
    Clock, Sparkles, Info
} from 'lucide-react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Toggle from '@/components/atoms/Toggle';

export default function RenderPage() {
    const [fileName, setFileName] = useState('Cinematic_Edit_V2_Final');
    const [format, setFormat] = useState('mp4');
    const [resolution, setResolution] = useState('4k');
    const [neuralUpscale, setNeuralUpscale] = useState(true);
    const [noiseReduction, setNoiseReduction] = useState(false);
    const [renderProgress, setRenderProgress] = useState(0);
    const [isRendering, setIsRendering] = useState(true);

    useEffect(() => {
        if (!isRendering) return;
        const interval = setInterval(() => {
            setRenderProgress((prev) => {
                if (prev >= 84) {
                    return 84;
                }
                return prev + Math.random() * 2;
            });
        }, 200);
        return () => clearInterval(interval);
    }, [isRendering]);

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-border-dim bg-surface">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted">Projects</span>
                    <span className="text-muted">/</span>
                    <span className="text-white font-semibold">CINEMATIC_EDIT_V2.MP4</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-muted hover:text-white text-sm flex items-center gap-1.5 cursor-pointer">
                        <Clock className="w-4 h-4" />
                        Version History
                    </button>
                    <button className="text-muted hover:text-white cursor-pointer">⋯</button>
                </div>
            </header>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Video Preview */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 flex items-center justify-center p-6 bg-void-black">
                        <div className="relative w-full max-w-2xl aspect-video bg-deep-slate rounded-lg overflow-hidden border border-border-dim">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{
                                    backgroundImage: "url('https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=450&fit=crop')"
                                }}
                            />
                            {/* Play Button */}
                            <button className="absolute inset-0 flex items-center justify-center cursor-pointer">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-16 h-16 bg-electric-blue rounded-full flex items-center justify-center shadow-lg shadow-electric-blue/30"
                                >
                                    <Play className="w-6 h-6 text-white ml-1" />
                                </motion.div>
                            </button>
                        </div>
                    </div>

                    {/* Playback bar */}
                    <div className="px-6 pb-2">
                        <div className="w-full h-1 bg-soft-gray rounded-full overflow-hidden">
                            <div className="h-full bg-electric-blue rounded-full" style={{ width: '37%' }} />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-mono text-white">00:12:44:02</span>
                            <div className="flex items-center gap-3">
                                <button className="text-muted hover:text-white cursor-pointer"><Volume2 className="w-4 h-4" /></button>
                                <button className="text-muted hover:text-white cursor-pointer"><Maximize2 className="w-4 h-4" /></button>
                            </div>
                            <span className="text-xs font-mono text-muted">00:34:20:15</span>
                        </div>
                    </div>
                </div>

                {/* Render Settings Panel */}
                <aside className="w-80 bg-surface border-l border-border-dim overflow-y-auto p-5 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-white">Render Settings</h2>
                        <p className="text-xs text-muted mt-1">Configure final delivery assets</p>
                    </div>

                    <Input
                        label="FILE NAME"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <Select
                            label="FORMAT"
                            value={format}
                            options={[
                                { value: 'mp4', label: 'MP4 (H.264)' },
                                { value: 'mov', label: 'MOV (ProRes)' },
                                { value: 'webm', label: 'WebM (VP9)' },
                            ]}
                            onChange={setFormat}
                        />
                        <Select
                            label="RESOLUTION"
                            value={resolution}
                            options={[
                                { value: '4k', label: '4K (3840×2160)' },
                                { value: '1080p', label: '1080p' },
                                { value: '720p', label: '720p' },
                            ]}
                            onChange={setResolution}
                        />
                    </div>

                    {/* AI Enhancements */}
                    <div>
                        <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">AI Enhancements</h3>
                        <div className="space-y-0 bg-deep-slate rounded-[var(--radius)] border border-border-dim p-3">
                            <Toggle
                                label="Neural Upscaling"
                                description="AI-driven pixel restoration"
                                enabled={neuralUpscale}
                                onChange={setNeuralUpscale}
                            />
                            <div className="border-t border-border-dim" />
                            <Toggle
                                label="Noise Reduction"
                                description="Temporal grain removal"
                                enabled={noiseReduction}
                                onChange={setNoiseReduction}
                            />
                        </div>
                    </div>

                    {/* AI Progress */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-electric-blue animate-pulse" />
                                <span className="text-sm text-white">AI Finalizing...</span>
                            </div>
                            <span className="text-sm font-bold text-electric-blue">{Math.round(renderProgress)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-soft-gray rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-electric-blue rounded-full"
                                animate={{ width: `${renderProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <p className="text-[11px] text-muted">
                            Enhancing dynamic range and applying temporal stabilization.
                            <br />Estimated time remaining: <strong className="text-white">1m 42s</strong>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button className="w-full" size="lg" icon={<Download className="w-4 h-4" />}>
                            Download File
                        </Button>
                        <Button variant="secondary" className="w-full" size="lg" icon={<Share2 className="w-4 h-4" />}>
                            Share Review Link
                        </Button>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-electric-blue/10 border border-electric-blue/20 rounded-[var(--radius)] p-3 flex gap-2">
                        <Info className="w-4 h-4 text-electric-blue shrink-0 mt-0.5" />
                        <p className="text-xs text-muted">
                            Your project is being rendered in the cloud. You can safely close this tab; we&apos;ll notify you when it&apos;s ready.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
