'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Bell, Share2, RefreshCw, Sparkles, Info,
    Zap, Eye, Crosshair
} from 'lucide-react';
import Button from '@/components/atoms/Button';
import AIInsightCard from '@/components/molecules/AIInsightCard';

const scriptLines = [
    { num: 1, text: '', type: 'empty' },
    { num: 2, text: '  [EXT. DESERT - TWILIGHT]', type: 'direction' },
    { num: 3, text: '', type: 'empty' },
    { num: 4, text: '  The camera pans across the desolate landscape. Wind whips through skeletal', type: 'action' },
    { num: 5, text: '  shrubs.', type: 'action' },
    { num: 6, text: '', type: 'empty' },
    { num: 7, text: '  ELARA', type: 'character' },
    { num: 8, text: '  We need to find cover before the storm hits.', type: 'dialogue' },
    { num: 9, text: '', type: 'empty' },
    { num: 10, text: '  KAYN', type: 'character' },
    { num: 11, text: "  There's a bunker three miles north. We can hold there.", type: 'dialogue' },
    { num: 12, text: '', type: 'empty' },
    { num: 13, text: '  Static crackles as the transmission cuts out suddenly.', type: 'action' },
    { num: 14, text: '', type: 'empty' },
    { num: 15, text: '  [SFX: LOW HUM RISING]', type: 'sfx' },
    { num: 16, text: '', type: 'empty' },
    { num: 17, text: '  A distant light flickers on the horizon. Not a star. Moving too fast.', type: 'action' },
    { num: 18, text: '', type: 'empty' },
    { num: 19, text: '  ELARA', type: 'character' },
    { num: 20, text: '  Did you see that?', type: 'dialogue' },
    { num: 21, text: '', type: 'empty' },
    { num: 22, text: '  KAYN', type: 'character' },
    { num: 23, text: '  Eyes forward. Just keep moving.', type: 'dialogue' },
];

const tags = ['High Tension', 'Close-up', 'Outdoor', 'Sci-Fi', 'Low Light'];

export default function ScriptEditorPage() {
    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-3 border-b border-border-dim bg-surface">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted">Tailored Video</span>
                    <span className="text-muted">›</span>
                    <span className="text-white font-semibold">Scene 1: The Arrival</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-muted hover:text-white cursor-pointer"><Bell className="w-4 h-4" /></button>
                    <button className="text-muted hover:text-white cursor-pointer"><Share2 className="w-4 h-4" /></button>
                </div>
            </header>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Script Editor */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="bg-deep-slate border border-border-dim rounded-[var(--radius)] overflow-hidden">
                        {/* Editor Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border-dim">
                            <h2 className="text-sm font-semibold text-white tracking-wide">SCRIPT EDITOR</h2>
                            <span className="text-[10px] text-muted tracking-wider">UTF-8 • SCRIPT MODE</span>
                        </div>

                        {/* Script Content */}
                        <div className="p-4 font-mono text-sm leading-relaxed min-h-[500px]">
                            {scriptLines.map((line) => (
                                <div key={line.num} className="flex hover:bg-soft-gray/30 transition-colors">
                                    <span className="w-10 text-right text-muted text-xs pr-3 py-0.5 select-none shrink-0">
                                        {line.num.toString().padStart(3, '0')}
                                    </span>
                                    <span
                                        className={`py-0.5 ${line.type === 'direction' ? 'text-electric-blue font-semibold' :
                                                line.type === 'sfx' ? 'text-success font-semibold italic' :
                                                    line.type === 'character' ? 'text-white font-bold' :
                                                        line.type === 'dialogue' ? 'text-white/90' :
                                                            line.type === 'action' ? 'text-muted-light' :
                                                                ''
                                            }`}
                                    >
                                        {line.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Insights Panel */}
                <aside className="w-80 glass-panel m-4 ml-0 overflow-y-auto flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <h3 className="text-sm font-semibold text-white">AI INSIGHTS</h3>
                        <button className="text-muted hover:text-white cursor-pointer">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Scene Metadata */}
                    <div className="p-4 border-b border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-muted" />
                            <h4 className="text-xs font-semibold text-muted uppercase tracking-wider">Scene Metadata</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[10px] text-muted uppercase tracking-wider">Resolution</p>
                                <p className="text-sm font-semibold text-white">4K (3840×2160)</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted uppercase tracking-wider">Frame Rate</p>
                                <p className="text-sm font-semibold text-white">23.976 fps</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted uppercase tracking-wider">Duration</p>
                                <p className="text-sm font-semibold text-white">02:45:12</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted uppercase tracking-wider">Format</p>
                                <p className="text-sm font-semibold text-white">ProRes 422 HQ</p>
                            </div>
                        </div>
                    </div>

                    {/* Auto-Generated Tags */}
                    <div className="p-4 border-b border-white/5">
                        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Auto-Generated Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, i) => (
                                <span
                                    key={tag}
                                    className={`px-3 py-1 text-xs rounded-full border cursor-pointer transition-colors ${i === 0
                                            ? 'border-electric-blue text-electric-blue bg-electric-blue/10'
                                            : 'border-border-dim text-muted hover:text-white hover:border-muted'
                                        }`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Visual Observations */}
                    <div className="p-4 flex-1">
                        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Visual Observations</h4>
                        <AIInsightCard
                            icon={<Zap className="w-4 h-4" />}
                            title="Pacing Warning"
                            description="The transition between lines 008 and 010 suggests a faster cut than currently storyboarded."
                            color="text-warning"
                        />
                        <AIInsightCard
                            icon={<Eye className="w-4 h-4" />}
                            title="Color Profile Suggestion"
                            description="AI detected sub-optimal exposure in the horizon background. Suggest a +0.5 stop increase during grading."
                        />
                        <AIInsightCard
                            icon={<Crosshair className="w-4 h-4" />}
                            title="Compositional Focus"
                            description="Central focus detected on protagonist 'Elara'. Secondary focus point 'Horizon' lacks sharp contrast."
                            color="text-danger"
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 p-4 border-t border-white/5">
                        <button className="text-muted hover:text-white text-sm cursor-pointer">
                            Discard Draft
                        </button>
                        <Button icon={<Sparkles className="w-4 h-4" />}>
                            Generate AI Edit
                        </Button>
                    </div>
                </aside>
            </div>
        </div>
    );
}
