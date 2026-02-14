'use client';

import React from 'react';

type BadgeType = 'video' | 'audio' | 'image' | 'ai';

interface BadgeProps {
    type: BadgeType;
    children?: React.ReactNode;
}

const badgeConfig: Record<BadgeType, { bg: string; text: string; label: string }> = {
    video: { bg: 'bg-badge-video/20', text: 'text-badge-video', label: 'VIDEO' },
    audio: { bg: 'bg-badge-audio/20', text: 'text-badge-audio', label: 'AUDIO' },
    image: { bg: 'bg-badge-image/20', text: 'text-badge-image', label: 'IMAGE' },
    ai: { bg: 'bg-electric-blue/20', text: 'text-electric-blue', label: 'AI' },
};

export default function Badge({ type, children }: BadgeProps) {
    const config = badgeConfig[type];
    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase
        ${config.bg} ${config.text}
      `}
        >
            {children || config.label}
        </span>
    );
}
