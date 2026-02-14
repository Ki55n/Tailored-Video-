'use client';

import React from 'react';

interface AssetRowProps {
    name: string;
    type: 'video' | 'audio' | 'image';
    duration: string;
    size: string;
    resolution: string;
    dateAdded: string;
    selected: boolean;
    onSelect: () => void;
}

const typeColors = {
    video: 'bg-badge-video/20 text-badge-video',
    audio: 'bg-badge-audio/20 text-badge-audio',
    image: 'bg-badge-image/20 text-badge-image',
};

const typeIcons: Record<string, string> = {
    video: '🎬',
    audio: '🎵',
    image: '🖼️',
};

export default function AssetRow({
    name, type, duration, size, resolution, dateAdded, selected, onSelect,
}: AssetRowProps) {
    return (
        <div
            className={`
        grid grid-cols-[40px_80px_1fr_100px_100px_80px_100px_120px] items-center gap-2 px-4 py-3
        border-b border-border-dim hover:bg-soft-gray/30 transition-colors cursor-pointer
        ${selected ? 'bg-electric-blue/5' : ''}
      `}
            onClick={onSelect}
        >
            {/* Checkbox */}
            <div className="flex items-center justify-center">
                <div className={`w-4 h-4 rounded border ${selected ? 'bg-electric-blue border-electric-blue' : 'border-border-dim'} flex items-center justify-center`}>
                    {selected && <span className="text-white text-[10px]">✓</span>}
                </div>
            </div>

            {/* Thumbnail */}
            <div className="w-16 h-11 bg-soft-gray rounded-lg flex items-center justify-center text-lg overflow-hidden relative">
                <span>{typeIcons[type]}</span>
                {type === 'video' && duration !== '—' && (
                    <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[8px] text-white px-1 rounded">
                        {duration}
                    </span>
                )}
            </div>

            {/* Name */}
            <span className="text-sm text-white truncate">{name}</span>

            {/* Type Badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider w-fit ${typeColors[type]}`}>
                {type}
            </span>

            {/* Duration */}
            <span className="text-sm text-muted">{duration}</span>

            {/* Size */}
            <span className="text-sm text-muted">{size}</span>

            {/* Resolution */}
            <span className="text-sm text-muted">{resolution}</span>

            {/* Date */}
            <span className="text-sm text-muted">{dateAdded}</span>
        </div>
    );
}
