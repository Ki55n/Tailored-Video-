'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

interface ProjectCardProps {
    title: string;
    duration: string;
    editedAt: string;
    resolution: string;
    thumbnail: string;
}

export default function ProjectCard({ title, duration, editedAt, resolution, thumbnail }: ProjectCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-deep-slate rounded-[var(--radius)] overflow-hidden border border-border-dim hover:border-electric-blue/30 transition-colors cursor-pointer group"
        >
            {/* Thumbnail */}
            <div className="relative w-full h-40 bg-soft-gray overflow-hidden">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${thumbnail})` }}
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
                    {duration}
                </div>
            </div>

            {/* Info */}
            <div className="p-3 flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                    <h3 className="text-sm font-medium text-white truncate">{title}</h3>
                    <p className="text-xs text-muted">{editedAt} • {resolution}</p>
                </div>
                <button className="text-muted hover:text-white transition-colors mt-0.5 cursor-pointer">
                    <MoreVertical className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}
