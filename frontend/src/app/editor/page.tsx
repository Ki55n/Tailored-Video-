'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Pause, Volume2, Maximize2, Undo2, Redo2,
    Share2, Scissors, Sparkles, Download, Send,
    Wand2, ChevronRight, User, Loader2, Bot
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/atoms/Button';
import { useTimelineStore } from '@/stores/useTimelineStore';

const API_BASE = '/server';

interface ChatEntry {
    type: 'user' | 'ai' | 'error';
    message: string;
    filename?: string;
    url?: string;
    timestamp: string;
}

const SUGGESTED_ACTIONS = [
    { label: "✂️ Trim Silence", query: "trim the video to remove silence" },
    { label: "🎨 Cinematic B&W", query: "apply black and white cinematic filter" },
    { label: "🗣️ Translate to Hindi", query: "translate audio to hindi" },
    { label: "⚡ Make Viral", query: "speed up and add captions" },
];

export default function EditorPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-void-black">
                <Loader2 className="w-8 h-8 text-electric-blue animate-spin" />
            </div>
        }>
            <EditorContent />
        </Suspense>
    );
}

function EditorContent() {
    const { duration } = useTimelineStore();
    const searchParams = useSearchParams();
    const uploadedFile = searchParams.get('file') || '';

    // Video State
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [currentFilename, setCurrentFilename] = useState(uploadedFile);

    // Chat State
    const [aiQuery, setAiQuery] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatEntry[]>([
        {
            type: 'ai',
            message: `Hi there! I'm ready to help you edit **${uploadedFile}**. What would you like to do?`,
            timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Initial scroll to bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    // Video source — always point to the latest file
    const videoSrc = currentFilename
        ? (currentFilename === uploadedFile
            ? `${API_BASE}/uploads/${encodeURIComponent(currentFilename)}`
            : `${API_BASE}/edited/${encodeURIComponent(currentFilename)}`)
        : '';

    const handlePlayPause = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const getTimestamp = () => {
        return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const handleGenerateEdit = async (queryOverride?: string) => {
        const queryToUse = queryOverride || aiQuery;
        if (!currentFilename || !queryToUse.trim()) return;

        setAiQuery('');
        setIsGenerating(true);

        // Add user message to chat
        setChatHistory(prev => [...prev, {
            type: 'user',
            message: queryToUse,
            timestamp: getTimestamp(),
        }]);

        try {
            const formData = new FormData();
            formData.append('filename', currentFilename);
            formData.append('query', queryToUse);

            const res = await fetch(`${API_BASE}/generate-edit`, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const errData = await res.json();
                setChatHistory(prev => [...prev, {
                    type: 'error',
                    message: errData.detail || 'Processing failed',
                    timestamp: getTimestamp(),
                }]);
            } else {
                const data = await res.json();
                setCurrentFilename(data.output_filename);

                setChatHistory(prev => [...prev, {
                    type: 'ai',
                    message: `Done! ${data.description}`,
                    filename: data.output_filename,
                    url: `${API_BASE}${data.download_url}`,
                    timestamp: getTimestamp(),
                }]);

                if (videoRef.current) {
                    // Slight delay to ensure file is ready
                    setTimeout(() => videoRef.current?.load(), 500);
                }
            }
        } catch (err) {
            setChatHistory(prev => [...prev, {
                type: 'error',
                message: 'Failed to connect to the server.',
                timestamp: getTimestamp(),
            }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGenerateEdit();
        }
    };

    return (
        <div className="flex h-screen bg-void-black overflow-hidden font-sans">
            {/* LEFT: Video Preview Area (65%) */}
            <div className="flex-1 flex flex-col relative border-r border-border-dim">
                {/* Header */}
                <header className="flex items-center justify-between px-6 py-4 bg-surface border-b border-border-dim z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-electric-blue rounded-lg flex items-center justify-center">
                            <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold tracking-wider text-white">PROJECT STUDIO</h1>
                            <p className="text-[10px] text-muted">{currentFilename}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-deep-slate rounded-lg p-1 border border-border-dim mr-4">
                            <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-muted hover:text-white"><Undo2 className="w-4 h-4" /></button>
                            <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-muted hover:text-white"><Redo2 className="w-4 h-4" /></button>
                        </div>
                        <Button variant="secondary" size="sm" icon={<Share2 className="w-3.5 h-3.5" />}>Share</Button>
                        <Button size="sm">Export 4K</Button>
                    </div>
                </header>

                {/* Video Player */}
                <div className="flex-1 flex items-center justify-center bg-black/50 p-8">
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/5 group">
                        {videoSrc ? (
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                className="w-full h-full object-contain"
                                onClick={handlePlayPause}
                                onEnded={() => setIsPlaying(false)}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted">No video loaded</div>
                        )}

                        {/* Play Overlay */}
                        {videoSrc && !isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors cursor-pointer" onClick={handlePlayPause}>
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-xl"
                                >
                                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                                </motion.div>
                            </div>
                        )}

                        {/* Video Controls Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-between text-white">
                                <span className="text-xs font-mono">00:00 / {videoRef.current?.duration ? new Date(videoRef.current.duration * 1000).toISOString().substr(14, 5) : "--:--"}</span>
                                <div className="flex gap-4">
                                    <Volume2 className="w-5 h-5 cursor-pointer hover:text-electric-blue" />
                                    <Maximize2 className="w-5 h-5 cursor-pointer hover:text-electric-blue" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: Conversational AI Sidebar (35%) */}
            <div className="w-[450px] bg-surface flex flex-col relative shadow-2xl border-l-[1px] border-white/5">
                {/* Chat Header */}
                <div className="p-4 border-b border-border-dim flex items-center gap-3 bg-surface/95 backdrop-blur z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-purple-600 flex items-center justify-center shadow-lg shadow-electric-blue/20">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-white">AI Video Assistant</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            <span className="text-[10px] text-muted font-medium">Online & Ready</span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {chatHistory.map((entry, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] flex gap-3 ${entry.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center mt-1 ${entry.type === 'user' ? 'bg-deep-slate border border-white/10' : 'bg-gradient-to-br from-electric-blue to-purple-600 shadow-lg shadow-electric-blue/20'
                                    }`}>
                                    {entry.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                                </div>

                                {/* Message Bubble */}
                                <div className="flex flex-col gap-1">
                                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${entry.type === 'user'
                                            ? 'bg-electric-blue text-white rounded-tr-none'
                                            : entry.type === 'error'
                                                ? 'bg-danger/10 border border-danger/20 text-danger rounded-tl-none'
                                                : 'bg-deep-slate border border-white/5 text-white/90 rounded-tl-none'
                                        }`}>
                                        <div dangerouslySetInnerHTML={{ __html: entry.message.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>') }} />
                                    </div>

                                    {/* Timestamp */}
                                    <span className={`text-[10px] text-muted/40 ${entry.type === 'user' ? 'text-right' : 'text-left'}`}>
                                        {entry.timestamp}
                                    </span>

                                    {/* Action Card (Only for AI success responses) */}
                                    {entry.type === 'ai' && entry.filename && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-2 p-3 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between gap-3"
                                        >
                                            <div className="flex items-center gap-3 overflow-hidden">
                                                <div className="w-10 h-10 bg-black/40 rounded-lg flex items-center justify-center shrink-0">
                                                    <Play className="w-4 h-4 text-white/50" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-xs font-medium text-white truncate">{entry.filename}</p>
                                                    <p className="text-[10px] text-muted">Ready for preview</p>
                                                </div>
                                            </div>
                                            <a href={entry.url} download className="shrink-0">
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-electric-blue transition-colors">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </a>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {isGenerating && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                            <div className="max-w-[85%] flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-purple-600 flex items-center justify-center mt-1">
                                    <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
                                </div>
                                <div className="px-4 py-3 bg-deep-slate border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </motion.div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-surface border-t border-border-dim space-y-4">
                    {/* Suggested Chips */}
                    {!isGenerating && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mask-fade-right">
                            {SUGGESTED_ACTIONS.map((action, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleGenerateEdit(action.query)}
                                    className="px-3 py-1.5 bg-deep-slate hover:bg-white/10 border border-white/5 hover:border-electric-blue/50 rounded-full text-xs text-white/80 hover:text-white transition-all whitespace-nowrap flex items-center gap-1.5 shadow-sm"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Text Input */}
                    <div className="relative">
                        <textarea
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe how you want to edit the video..."
                            className="w-full bg-deep-slate border border-border-dim hover:border-white/10 focus:border-electric-blue rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-muted focus:outline-none resize-none h-[52px] shadow-inner transition-colors"
                            disabled={isGenerating}
                        />
                        <button
                            onClick={() => handleGenerateEdit()}
                            disabled={!aiQuery.trim() || isGenerating}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-electric-blue hover:bg-electric-blue-hover disabled:bg-white/5 disabled:text-white/20 text-white rounded-lg transition-all shadow-lg shadow-electric-blue/20"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-muted/40">
                        AI can make mistakes. Please review generated clips.
                    </p>
                </div>
            </div>
        </div>
    );
}
