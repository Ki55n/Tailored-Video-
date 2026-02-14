'use client';

import React from 'react';

interface SkeletonProps {
    className?: string;
}

export function SkeletonCard({ className = '' }: SkeletonProps) {
    return (
        <div className={`rounded-[var(--radius)] overflow-hidden ${className}`}>
            <div className="skeleton w-full h-40" />
            <div className="p-3 space-y-2 bg-deep-slate">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-3 w-1/2" />
            </div>
        </div>
    );
}

export function SkeletonRow({ className = '' }: SkeletonProps) {
    return (
        <div className={`flex items-center gap-4 py-4 px-4 ${className}`}>
            <div className="skeleton w-16 h-12 rounded-lg shrink-0" />
            <div className="skeleton h-4 w-48" />
            <div className="skeleton h-4 w-16 ml-auto" />
            <div className="skeleton h-4 w-12" />
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 w-24" />
        </div>
    );
}
