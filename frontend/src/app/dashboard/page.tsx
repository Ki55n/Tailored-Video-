'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, Plus, Bell, Cloud, Globe, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/atoms/Button';
import ProjectCard from '@/components/molecules/ProjectCard';
import StatusCard from '@/components/molecules/StatusCard';

const API_BASE = '/server';

const projects = [
    {
        title: 'Winter Expedition 2024',
        duration: '02:45',
        editedAt: 'Edited 4 hours ago',
        resolution: '4K HDR',
        thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=250&fit=crop',
    },
    {
        title: 'Cyberpunk Music Video',
        duration: '00:58',
        editedAt: 'Edited 2 days ago',
        resolution: '1080p',
        thumbnail: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&h=250&fit=crop',
    },
    {
        title: 'Cyberpunk Music Video',
        duration: '00:58',
        editedAt: 'Edited 2 days ago',
        resolution: '1080p',
        thumbnail: 'https://images.unsplash.com/photo-1534996858221-380b92700493?w=400&h=250&fit=crop',
    },
    {
        title: 'Product Showcase v4',
        duration: '01:20',
        editedAt: 'Edited 2 weeks ago',
        resolution: '4K HDR',
        thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=250&fit=crop',
    },
];

export default function DashboardPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const router = useRouter();

    const handleUpload = async (file: File) => {
        setUploading(true);
        setUploadedFile(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE}/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.status === 'success') {
                setUploadedFile(data.filename);
                // Navigate to editor with the uploaded filename
                setTimeout(() => {
                    router.push(`/editor?file=${encodeURIComponent(data.filename)}`);
                }, 1500);
            }
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(file);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-xs text-muted mt-1">
                        AI-powered video timeline editor for professional end-to-end generation. Powered by Gemini 3 API.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            placeholder="Search projects..."
                            className="bg-deep-slate border border-border-dim rounded-[var(--radius)] pl-9 pr-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-electric-blue w-56"
                        />
                    </div>
                    <Button icon={<Plus className="w-4 h-4" />}>
                        New Project
                    </Button>
                    <button className="text-muted hover:text-white transition-colors cursor-pointer">
                        <Bell className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Upload Zone */}
            <motion.div
                whileHover={{ borderColor: 'rgba(0,122,255,0.5)' }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`
                    border border-dashed rounded-[var(--radius)] bg-deep-slate/50 p-12 flex flex-col items-center gap-4 transition-colors
                    ${dragOver ? 'border-electric-blue bg-electric-blue/5' : 'border-border-dim'}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={onFileChange}
                />

                {uploading ? (
                    <>
                        <Loader2 className="w-10 h-10 text-electric-blue animate-spin" />
                        <h2 className="text-lg font-semibold text-white">Uploading...</h2>
                        <p className="text-sm text-muted">Your video is being processed by the server.</p>
                    </>
                ) : uploadedFile ? (
                    <>
                        <CheckCircle className="w-10 h-10 text-success" />
                        <h2 className="text-lg font-semibold text-white">Upload Complete!</h2>
                        <p className="text-sm text-muted">Redirecting to editor with <strong className="text-white">{uploadedFile}</strong>...</p>
                    </>
                ) : (
                    <>
                        <div className="w-14 h-14 bg-electric-blue/15 rounded-2xl flex items-center justify-center">
                            <Upload className="w-7 h-7 text-electric-blue" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Upload Clips</h2>
                        <p className="text-sm text-muted text-center max-w-sm">
                            Drag and drop your media files here to start a new professional edit. Supports 4K, ProRes, and HDR formats.
                        </p>
                        <Button variant="secondary" size="md" onClick={() => fileInputRef.current?.click()}>
                            BROWSE FILES
                        </Button>
                    </>
                )}
            </motion.div>

            {/* Recent Projects */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Recent Projects</h2>
                    <button className="text-electric-blue text-sm hover:underline flex items-center gap-1 cursor-pointer">
                        View all projects <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <ProjectCard {...project} />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatusCard icon={<Cloud className="w-5 h-5 text-electric-blue" />} title="Cloud Storage">
                    <div className="space-y-2">
                        <div className="w-full h-1.5 bg-soft-gray rounded-full overflow-hidden">
                            <div className="h-full bg-electric-blue rounded-full" style={{ width: '65%' }} />
                        </div>
                        <div className="flex justify-between text-xs text-muted">
                            <span>128.5 GB of 200 GB used</span>
                            <span>65%</span>
                        </div>
                    </div>
                </StatusCard>

                <StatusCard icon={<Globe className="w-5 h-5 text-electric-blue" />} title="Render Node Status">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-success rounded-full" />
                            <span className="text-sm text-white">4 nodes active</span>
                        </div>
                        <p className="text-xs text-muted">Current render queue: 0 projects</p>
                    </div>
                </StatusCard>

                <StatusCard icon={<span className="text-xl">👑</span>} title="Pro Editor Plan">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">Renews on Oct 12, 2024</span>
                        <Button variant="primary" size="sm">UPGRADE</Button>
                    </div>
                </StatusCard>
            </div>
        </div>
    );
}
